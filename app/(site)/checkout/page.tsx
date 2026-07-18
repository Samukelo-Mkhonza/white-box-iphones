import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getCart, cartSubtotalCents } from "@/lib/cart";
import { getStoreSettings } from "@/lib/settings";
import { formatZAR } from "@/lib/format";
import { conditionLabel, formatStorage } from "@/lib/products";
import { CheckoutForm } from "@/components/CheckoutForm";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const cart = await getCart();
  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  const settings = await getStoreSettings();
  const subtotalCents = cartSubtotalCents(cart);
  const totalCents = subtotalCents + settings.flatShippingFeeCents;
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]}
      />
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl">Checkout</h1>
        <Link
          href="/cart"
          className="text-sm text-zinc-500 hover:text-foreground dark:text-zinc-400"
        >
          &larr; Back to cart
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <CheckoutForm />

        <div className="h-fit rounded-2xl border border-zinc-200 p-5 lg:sticky lg:top-24 dark:border-zinc-800">
          <h2 className="mb-4 font-semibold">
            Order Summary{" "}
            <span className="font-normal text-zinc-400 dark:text-zinc-500">
              ({itemCount} item{itemCount === 1 ? "" : "s"})
            </span>
          </h2>
          <div className="space-y-4 text-sm">
            {cart.items.map((item) => {
              const image = item.variant.colourway.images[0];
              return (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 rounded-lg">
                    {image && (
                      <Image
                        src={image.url}
                        alt={image.altText}
                        fill
                        unoptimized
                        className="object-contain p-1.5"
                      />
                    )}
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[10px] font-medium text-background">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{item.variant.product.name}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {item.variant.colourway.name} &middot; {formatStorage(item.variant.storageGb)} &middot;{" "}
                      {conditionLabel(item.variant.condition)}
                    </p>
                  </div>
                  <span className="shrink-0 font-medium">
                    {formatZAR(item.quantity * item.variant.priceCents)}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 space-y-1 border-t border-zinc-200 pt-4 text-sm dark:border-zinc-800">
            <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
              <span>Subtotal</span>
              <span>{formatZAR(subtotalCents)}</span>
            </div>
            <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
              <span>Shipping</span>
              <span>
                {settings.flatShippingFeeCents === 0 ? "Free" : formatZAR(settings.flatShippingFeeCents)}
              </span>
            </div>
            <div className="flex justify-between pt-1 text-lg font-bold">
              <span>Total</span>
              <span>{formatZAR(totalCents)}</span>
            </div>
          </div>
          <p className="mt-4 flex items-center justify-center gap-1.5 border-t border-zinc-200 pt-4 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5"
              aria-hidden="true"
            >
              <rect x="4" y="10" width="16" height="10" rx="2" />
              <path d="M8 10V7a4 4 0 018 0v3" />
            </svg>
            Secure payment via PayFast &middot; all prices in ZAR
          </p>
        </div>
      </div>
    </div>
  );
}
