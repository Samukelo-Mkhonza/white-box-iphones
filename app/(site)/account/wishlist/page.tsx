import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth";
import { getWishlist } from "@/lib/wishlist";
import { formatZAR } from "@/lib/format";
import { removeWishlistItemAction } from "@/app/(site)/wishlist/actions";
import { PageHeader } from "@/components/account/PageHeader";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = { title: "Wishlist" };

const CRUMBS = [
  { label: "Home", href: "/" },
  { label: "Account", href: "/account" },
  { label: "Wishlist" },
];

export default async function WishlistPage() {
  const user = await getCurrentUser();
  if (!user) return null; // guarded by layout

  const items = await getWishlist(user.id);

  if (items.length === 0) {
    return (
      <div>
        <Breadcrumbs items={CRUMBS} />
        <PageHeader title="Wishlist" description="Phones you're keeping an eye on." />
        <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-zinc-300 px-6 py-16 text-center dark:border-zinc-700">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-10 w-10 text-zinc-300 dark:text-zinc-600"
            aria-hidden="true"
          >
            <path d="M12 20.5l-7.6-7.8a4.8 4.8 0 010-6.7 4.6 4.6 0 016.6 0l1 1 1-1a4.6 4.6 0 016.6 0 4.8 4.8 0 010 6.7L12 20.5z" />
          </svg>
          <p className="mt-4 font-medium">Your wishlist is empty</p>
          <p className="mt-1 max-w-xs text-sm text-zinc-500 dark:text-zinc-400">
            Save phones you&apos;re considering by tapping &ldquo;Add to Wishlist&rdquo; on any product page.
          </p>
          <Link
            href="/shop"
            className="mt-6 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-80"
          >
            Browse phones
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs items={CRUMBS} />
      <PageHeader
        title="Wishlist"
        description={`${items.length} item${items.length === 1 ? "" : "s"} saved for later.`}
      />
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((item) => {
          const image = item.product.colourways[0]?.images[0];
          const prices = item.product.variants.map((v) => v.priceCents);
          const minPriceCents = prices.length ? Math.min(...prices) : null;
          const inStock = item.product.variants.some((v) => v.stockQty > 0);
          return (
            <div
              key={item.id}
              className="flex flex-col rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <div className="flex items-start gap-4">
                <Link
                  href={`/product/${item.product.slug}`}
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-50 dark:bg-zinc-900"
                >
                  {image && (
                    <Image src={image.url} alt={image.altText} fill unoptimized className="object-contain p-2" />
                  )}
                </Link>
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    {item.product.series}
                  </p>
                  <Link href={`/product/${item.product.slug}`} className="font-medium hover:underline">
                    {item.product.name}
                  </Link>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                    {minPriceCents !== null && (
                      <span className="font-semibold">From {formatZAR(minPriceCents)}</span>
                    )}
                    {inStock ? (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                        In stock
                      </span>
                    ) : (
                      <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                        Out of stock
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-zinc-200 pt-3 dark:border-zinc-800">
                <Link
                  href={`/product/${item.product.slug}`}
                  className="rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background hover:opacity-80"
                >
                  Choose options
                </Link>
                <form action={removeWishlistItemAction.bind(null, item.productId)}>
                  <button
                    type="submit"
                    className="text-xs text-zinc-500 underline hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400"
                  >
                    Remove
                  </button>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
