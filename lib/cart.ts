import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

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

// Logged-in users' carts are looked up by userId first (works across
// devices); guests (and users who haven't merged a cart yet) fall back to
// the browser's cart cookie.
export async function getCart() {
  const user = await getCurrentUser();
  if (user) {
    const cart = await prisma.cart.findFirst({ where: { userId: user.id }, include: CART_INCLUDE });
    if (cart) return cart;
  }

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

async function getOrCreateCart() {
  const user = await getCurrentUser();
  const token = await getOrCreateCartToken();

  if (user) {
    const existing = await prisma.cart.findFirst({ where: { userId: user.id } });
    if (existing) return existing;
    // Adopt whatever guest cart this browser already has, if any.
    return prisma.cart.upsert({
      where: { sessionToken: token },
      update: { userId: user.id },
      create: { sessionToken: token, userId: user.id },
    });
  }

  return prisma.cart.upsert({
    where: { sessionToken: token },
    update: {},
    create: { sessionToken: token },
  });
}

export async function addToCart(variantId: string, quantity: number) {
  const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
  if (!variant) throw new Error("Product variant not found");

  const cart = await getOrCreateCart();

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

async function assertOwnsCartItem(itemId: string) {
  const user = await getCurrentUser();
  const token = await readCartToken();
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true, variant: true },
  });
  if (!item) return null;
  const owns = (user && item.cart.userId === user.id) || (!!token && item.cart.sessionToken === token);
  return owns ? item : null;
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  const item = await assertOwnsCartItem(itemId);
  if (!item) return;

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
    return;
  }
  const clamped = Math.min(quantity, item.variant.stockQty);
  await prisma.cartItem.update({ where: { id: itemId }, data: { quantity: clamped } });
}

export async function removeCartItem(itemId: string) {
  const item = await assertOwnsCartItem(itemId);
  if (!item) return;
  await prisma.cartItem.delete({ where: { id: itemId } });
}

export async function clearCart() {
  const cart = await getCart();
  if (!cart) return;
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
}

// Called right after a guest logs in or registers: folds whatever was in
// their cookie-based cart into their account cart, then re-points the
// cookie at the surviving cart so this browser keeps working either way.
export async function mergeGuestCartIntoUser(userId: string) {
  const token = await getOrCreateCartToken();
  const guestCart = await prisma.cart.findUnique({ where: { sessionToken: token }, include: { items: true } });
  if (!guestCart || guestCart.userId === userId) return;

  const userCart = await prisma.cart.findFirst({ where: { userId } });

  if (!userCart) {
    await prisma.cart.update({ where: { id: guestCart.id }, data: { userId } });
    return;
  }

  for (const item of guestCart.items) {
    const existing = await prisma.cartItem.findUnique({
      where: { cartId_variantId: { cartId: userCart.id, variantId: item.variantId } },
    });
    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + item.quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: userCart.id, variantId: item.variantId, quantity: item.quantity },
      });
    }
  }

  await prisma.cart.delete({ where: { id: guestCart.id } });
  await prisma.cart.update({ where: { id: userCart.id }, data: { sessionToken: token } });
}
