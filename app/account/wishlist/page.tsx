import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth";
import { getWishlist } from "@/lib/wishlist";
import { removeWishlistItemAction } from "@/app/wishlist/actions";

export const metadata: Metadata = { title: "Wishlist" };

export default async function WishlistPage() {
  const user = await getCurrentUser();
  if (!user) return null; // guarded by layout

  const items = await getWishlist(user.id);

  if (items.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Wishlist</h1>
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
          Save phones you&apos;re considering by tapping &ldquo;Add to Wishlist&rdquo; on any product page.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Wishlist</h1>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((item) => {
          const image = item.product.colourways[0]?.images[0];
          return (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800"
            >
              {image && (
                <div className="relative h-16 w-16 shrink-0 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                  <Image src={image.url} alt={image.altText} fill unoptimized className="object-contain p-2" />
                </div>
              )}
              <div className="flex-1">
                <Link href={`/product/${item.product.slug}`} className="font-medium hover:underline">
                  {item.product.name}
                </Link>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{item.product.series}</p>
              </div>
              <form action={removeWishlistItemAction.bind(null, item.productId)}>
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
    </div>
  );
}
