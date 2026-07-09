import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getCart, cartSubtotalCents } from "@/lib/cart";
import { getStoreSettings } from "@/lib/settings";
import { conditionLabel, formatStorage } from "@/lib/products";
import { formatZAR } from "@/lib/format";
import { updateQuantityAction, removeItemAction } from "@/app/(site)/cart/actions";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = { title: "Your Cart" };

export default async function CartPage() {
  const [cart, settings] = await Promise.all([getCart(), getStoreSettings()]);
  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Your cart is empty</h1>
        <p className="mt-3 text-zinc-500 dark:text-zinc-400">
          Browse our range of certified white-box iPhones to get started.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-80"
        >
          Go to Shop
        </Link>
      </div>
    );
  }

  const subtotalCents = cartSubtotalCents(cart!);
  const totalCents = subtotalCents + settings.flatShippingFeeCents;
  const hasStockIssue = items.some((item) => item.quantity > item.variant.stockQty);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
      <h1 className="text-3xl font-bold tracking-tight">Your Cart</h1>

      <div className="mt-8 space-y-4">
        {items.map((item) => {
          const image = item.variant.colourway.images[0];
          const lineTotal = item.quantity * item.variant.priceCents;
          const outOfStock = item.quantity > item.variant.stockQty;
          return (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-2xl border border-zinc-200 p-4 sm:flex-row sm:items-center dark:border-zinc-800"
            >
              {image && (
                <div className="relative h-20 w-20 shrink-0 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                  <Image src={image.url} alt={image.altText} fill unoptimized className="object-contain p-2" />
                </div>
              )}
              <div className="flex-1">
                <Link href={`/product/${item.variant.product.slug}`} className="font-semibold hover:underline">
                  {item.variant.product.name}
                </Link>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {item.variant.colourway.name} &middot; {formatStorage(item.variant.storageGb)} &middot;{" "}
                  {conditionLabel(item.variant.condition)}
                </p>
                <p className="text-sm font-medium">{formatZAR(item.variant.priceCents)} each</p>
                {outOfStock && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    Only {item.variant.stockQty} left in stock &mdash; please update the quantity.
                  </p>
                )}
              </div>

              <form action={updateQuantityAction.bind(null, item.id)} className="flex items-center gap-2">
                <label htmlFor={`qty-${item.id}`} className="sr-only">
                  Quantity
                </label>
                <input
                  id={`qty-${item.id}`}
                  name="quantity"
                  type="number"
                  min={1}
                  max={item.variant.stockQty}
                  defaultValue={item.quantity}
                  className="w-16 rounded-md border border-zinc-200 bg-transparent px-2 py-1.5 text-sm dark:border-zinc-700"
                />
                <button
                  type="submit"
                  className="rounded-md border border-zinc-200 px-3 py-1.5 text-xs font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
                >
                  Update
                </button>
              </form>

              <p className="w-24 text-right font-semibold">{formatZAR(lineTotal)}</p>

              <form action={removeItemAction.bind(null, item.id)}>
                <button
                  type="submit"
                  className="text-xs text-zinc-500 underline hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400"
                >
                  Remove
                </button>
              </form>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col items-end gap-2 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <div className="flex w-full max-w-xs justify-between text-sm text-zinc-500 dark:text-zinc-400">
          <span>Subtotal</span>
          <span>{formatZAR(subtotalCents)}</span>
        </div>
        <div className="flex w-full max-w-xs justify-between text-sm text-zinc-500 dark:text-zinc-400">
          <span>Shipping</span>
          <span>{formatZAR(settings.flatShippingFeeCents)}</span>
        </div>
        <div className="flex w-full max-w-xs justify-between text-lg font-bold">
          <span>Total</span>
          <span>{formatZAR(totalCents)}</span>
        </div>

        {hasStockIssue ? (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            Please resolve the stock issues above before checking out.
          </p>
        ) : (
          <Link
            href="/checkout"
            className="mt-4 rounded-full bg-foreground px-8 py-3 text-sm font-medium text-background hover:opacity-80"
          >
            Proceed to Checkout
          </Link>
        )}
      </div>
    </div>
  );
}
