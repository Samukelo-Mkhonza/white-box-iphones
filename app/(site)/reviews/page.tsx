import type { Metadata } from "next";
import Link from "next/link";
import { getApprovedReviews, getReviewStats } from "@/lib/reviews";
import { StarRating } from "@/components/StarRating";

export const metadata: Metadata = {
  title: "Reviews",
  description: "What customers say about buying a White Box iPhone.",
};

export default async function ReviewsPage() {
  const [reviews, stats] = await Promise.all([getApprovedReviews(), getReviewStats()]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Customer Reviews</h1>
      {stats.count > 0 ? (
        <p className="mt-3 flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
          <StarRating rating={Math.round(stats.average)} />
          <span>
            {stats.average.toFixed(1)} out of 5 &middot; {stats.count} review{stats.count === 1 ? "" : "s"}
          </span>
        </p>
      ) : (
        <p className="mt-3 text-zinc-500 dark:text-zinc-400">No reviews yet.</p>
      )}

      <div className="mt-10 space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
            <div className="flex items-center justify-between gap-4">
              <StarRating rating={review.rating} />
              {review.verifiedPurchase && (
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                  Verified purchase
                </span>
              )}
            </div>
            <h2 className="mt-3 font-semibold">{review.title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{review.body}</p>
            <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
              {review.user.name} on{" "}
              <Link href={`/product/${review.product.slug}`} className="underline">
                {review.product.name}
              </Link>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
