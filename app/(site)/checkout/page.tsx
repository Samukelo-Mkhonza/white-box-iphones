import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCart, cartSubtotalCents } from "@/lib/cart";
import { getStoreSettings } from "@/lib/settings";
import { formatZAR } from "@/lib/format";
import { conditionLabel, formatStorage } from "@/lib/products";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const cart = await getCart();
  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  const settings = await getStoreSettings();
  const subtotalCents = cartSubtotalCents(cart);
  const totalCents = subtotalCents + settings.flatShippingFeeCents;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <CheckoutForm />

        <div className="h-fit rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
          <h2 className="mb-4 font-semibold">Order Summary</h2>
          <div className="space-y-3 text-sm">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between gap-4">
                <span className="text-zinc-500 dark:text-zinc-400">
                  {item.quantity} &times; {item.variant.product.name} ({item.variant.colourway.name},{" "}
                  {formatStorage(item.variant.storageGb)}, {conditionLabel(item.variant.condition)})
                </span>
                <span className="shrink-0 font-medium">{formatZAR(item.quantity * item.variant.priceCents)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-1 border-t border-zinc-200 pt-4 text-sm dark:border-zinc-800">
            <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
              <span>Subtotal</span>
              <span>{formatZAR(subtotalCents)}</span>
            </div>
            <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
              <span>Shipping</span>
              <span>{formatZAR(settings.flatShippingFeeCents)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatZAR(totalCents)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
