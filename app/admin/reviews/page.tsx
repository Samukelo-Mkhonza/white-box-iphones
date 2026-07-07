import type { Metadata } from "next";
import Link from "next/link";
import { getReviewsForAdmin } from "@/lib/admin";
import { StarRating } from "@/components/StarRating";
import { moderateReviewAction } from "@/app/admin/reviews/actions";
import type { ReviewStatus } from "@prisma/client";

export const metadata: Metadata = { title: "Admin · Reviews" };

const STATUSES: ReviewStatus[] = ["PENDING", "APPROVED", "REJECTED"];

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const validStatus = STATUSES.includes(status as ReviewStatus) ? (status as ReviewStatus) : "PENDING";
  const reviews = await getReviewsForAdmin(validStatus);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>

      <div className="mt-4 flex gap-2 text-sm">
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/reviews?status=${s}`}
            className={`rounded-full px-3 py-1 ${validStatus === s ? "bg-foreground text-background" : "border border-zinc-200 dark:border-zinc-700"}`}
          >
            {s.charAt(0) + s.slice(1).toLowerCase()}
          </Link>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
            <div className="flex items-center justify-between gap-4">
              <StarRating rating={review.rating} />
              <span className="text-xs text-zinc-400">{review.createdAt.toLocaleDateString("en-ZA")}</span>
            </div>
            <h2 className="mt-2 font-semibold">{review.title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{review.body}</p>
            <p className="mt-2 text-xs text-zinc-400">
              {review.user.name} on {review.product.name}
              {review.verifiedPurchase && " · Verified purchase"}
            </p>

            {validStatus === "PENDING" && (
              <div className="mt-4 flex gap-2">
                <form action={moderateReviewAction.bind(null, review.id, "APPROVED")}>
                  <button
                    type="submit"
                    className="rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background hover:opacity-80"
                  >
                    Approve
                  </button>
                </form>
                <form action={moderateReviewAction.bind(null, review.id, "REJECTED")}>
                  <button
                    type="submit"
                    className="rounded-full border border-red-300 px-4 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                  >
                    Reject
                  </button>
                </form>
              </div>
            )}
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            No {validStatus.toLowerCase()} reviews.
          </p>
        )}
      </div>
    </div>
  );
}
