import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";

const CART_COOKIE = "cart_token";

async function readCartToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(CART_COOKIE)?.value ?? null;
}

// Only callable from a Server Function or Route Handler -- it may need to
// set the cookie, which Server Components are not allowed to do.
async function getOrCreateCartToken(): Promise<string> {
  const store = await cookies();
  const existing = store.get(CART_COOKIE)?.value;
  if (existing) return existing;

  const token = randomUUID();
  store.set(CART_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return token;
}

const CART_INCLUDE = {
  items: {
    include: {
      variant: {
        include: {
          product: true,
          colourway: { include: { images: { orderBy: { position: "asc" as const } } } },
        },
      },
    },
    orderBy: { id: "asc" as const },
  },
} as const;

export type CartWithItems = Awaited<ReturnType<typeof getCart>>;

export async function getCart() {
  const token = await readCartToken();
  if (!token) return null;
  return prisma.cart.findUnique({ where: { sessionToken: token }, include: CART_INCLUDE });
}

export async function getCartItemCount(): Promise<number> {
  const cart = await getCart();
  if (!cart) return 0;
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}

export function cartSubtotalCents(cart: NonNullable<CartWithItems>): number {
  return cart.items.reduce((sum, item) => sum + item.quantity * item.variant.priceCents, 0);
}

export async function addToCart(variantId: string, quantity: number) {
  const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
  if (!variant) throw new Error("Product variant not found");

  const token = await getOrCreateCartToken();
  const cart = await prisma.cart.upsert({
    where: { sessionToken: token },
    update: {},
    create: { sessionToken: token },
  });

  const existingItem = await prisma.cartItem.findUnique({
    where: { cartId_variantId: { cartId: cart.id, variantId } },
  });
  const nextQuantity = Math.min((existingItem?.quantity ?? 0) + quantity, variant.stockQty);
  if (nextQuantity <= 0) return;

  await prisma.cartItem.upsert({
    where: { cartId_variantId: { cartId: cart.id, variantId } },
    update: { quantity: nextQuantity },
    create: { cartId: cart.id, variantId, quantity: nextQuantity },
  });
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  const token = await readCartToken();
  if (!token) return;
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true, variant: true },
  });
  if (!item || item.cart.sessionToken !== token) return;

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
    return;
  }
  const clamped = Math.min(quantity, item.variant.stockQty);
  await prisma.cartItem.update({ where: { id: itemId }, data: { quantity: clamped } });
}

export async function removeCartItem(itemId: string) {
  const token = await readCartToken();
  if (!token) return;
  const item = await prisma.cartItem.findUnique({ where: { id: itemId }, include: { cart: true } });
  if (!item || item.cart.sessionToken !== token) return;
  await prisma.cartItem.delete({ where: { id: itemId } });
}

export async function clearCart() {
  const token = await readCartToken();
  if (!token) return;
  const cart = await prisma.cart.findUnique({ where: { sessionToken: token } });
  if (!cart) return;
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
}
