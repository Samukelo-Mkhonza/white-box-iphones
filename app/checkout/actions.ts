"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCart, cartSubtotalCents, clearCart } from "@/lib/cart";
import { getStoreSettings } from "@/lib/settings";

function generateOrderNumber(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `WB-${stamp}-${rand}`;
}

export type CheckoutFormState = {
  status: "idle" | "error";
  message?: string;
};

export async function createOrderAction(
  _prevState: CheckoutFormState,
  formData: FormData
): Promise<CheckoutFormState> {
  const cart = await getCart();
  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  const nameFirst = String(formData.get("nameFirst") ?? "").trim();
  const nameLast = String(formData.get("nameLast") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const line1 = String(formData.get("line1") ?? "").trim();
  const line2 = String(formData.get("line2") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const province = String(formData.get("province") ?? "").trim();
  const postalCode = String(formData.get("postalCode") ?? "").trim();

  if (!nameFirst || !nameLast || !email || !line1 || !city || !province || !postalCode) {
    return { status: "error", message: "Please fill in all required shipping details." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  for (const item of cart.items) {
    if (item.quantity > item.variant.stockQty) {
      return {
        status: "error",
        message: `${item.variant.product.name} (${item.variant.colourway.name}) no longer has enough stock. Please update your cart.`,
      };
    }
  }

  const settings = await getStoreSettings();
  const subtotalCents = cartSubtotalCents(cart);
  const totalCents = subtotalCents + settings.flatShippingFeeCents;
  const orderNumber = generateOrderNumber();

  const order = await prisma.order.create({
    data: {
      orderNumber,
      guestEmail: email,
      status: "PENDING",
      subtotalCents,
      shippingFeeCents: settings.flatShippingFeeCents,
      totalCents,
      shippingAddress: JSON.stringify({
        nameFirst,
        nameLast,
        email,
        phone,
        line1,
        line2,
        city,
        province,
        postalCode,
      }),
      items: {
        create: cart.items.map((item) => ({
          variantId: item.variantId,
          productName: item.variant.product.name,
          colourName: item.variant.colourway.name,
          storageGb: item.variant.storageGb,
          condition: item.variant.condition,
          priceCentsAtOrder: item.variant.priceCents,
          quantity: item.quantity,
        })),
      },
    },
  });

  await clearCart();

  redirect(`/checkout/pay/${order.id}`);
}
