import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getRelatedProducts,
  parseSpecifications,
  getAllProductsWithRelations,
} from "@/lib/products";
import { getStoreSettings } from "@/lib/settings";
import { getCurrentUser } from "@/lib/auth";
import { isInWishlist } from "@/lib/wishlist";
import { getApprovedReviewsForProduct, getUserReviewForProduct } from "@/lib/reviews";
import { ProductVariantPicker } from "@/components/ProductVariantPicker";
import { ProductCard } from "@/components/ProductCard";
import { ReviewForm } from "@/components/ReviewForm";
import { StarRating } from "@/components/StarRating";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export async function generateStaticParams() {
  const products = await getAllProductsWithRelations();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: { title: product.name, description: product.description },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, settings, user, reviews] = await Promise.all([
    getRelatedProducts(product),
    getStoreSettings(),
    getCurrentUser(),
    getApprovedReviewsForProduct(product.id),
  ]);
  const specs = parseSpecifications(product);
  const [wishlisted, existingReview] = user
    ? await Promise.all([
        isInWishlist(user.id, product.id),
        getUserReviewForProduct(user.id, product.id),
      ])
    : [false, null];

  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: product.series, href: `/shop?series=${encodeURIComponent(product.series)}` },
          { label: product.name },
        ]}
      />

      <ProductVariantPicker
        productId={product.id}
        productName={product.name}
        colourways={product.colourways}
        minDeliveryDays={settings.minDeliveryDays}
        maxDeliveryDays={settings.maxDeliveryDays}
        initialWishlisted={wishlisted}
        averageRating={averageRating}
        reviewCount={reviews.length}
      />

      <div className="mt-16 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="mb-3 text-lg font-semibold">Description</h2>
          <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{product.description}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="mb-3 text-lg font-semibold">Specifications</h2>
          <dl className="divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
            {Object.entries(specs).map(([key, value]) => (
              <div key={key} className="flex justify-between gap-4 py-2">
                <dt className="capitalize text-zinc-500 dark:text-zinc-400">
                  {key.replace(/([A-Z])/g, " $1")}
                </dt>
                <dd className="text-right font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div id="reviews" className="mt-16 scroll-mt-24">
        <div className="mb-6 flex flex-wrap items-baseline gap-3">
          <h2 className="text-lg font-semibold">Customer Reviews</h2>
          {averageRating !== null && (
            <span className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <StarRating rating={Math.round(averageRating)} />
              {averageRating.toFixed(1)} out of 5 &middot; {reviews.length} review
              {reviews.length === 1 ? "" : "s"}
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">No reviews yet for this product.</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
                  <div className="flex items-center justify-between gap-4">
                    <StarRating rating={review.rating} />
                    {review.verifiedPurchase && (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                        Verified purchase
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 font-semibold">{review.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{review.body}</p>
                  <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">{review.user.name}</p>
                </div>
              ))
            )}
          </div>

          <div>
            {existingReview ? (
              <p className="rounded-2xl border border-zinc-200 p-4 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                You&apos;ve already reviewed this product
                {existingReview.status === "PENDING" ? " — it's awaiting approval." : "."}
              </p>
            ) : user ? (
              <ReviewForm productId={product.id} productSlug={product.slug} />
            ) : (
              <p className="rounded-2xl border border-zinc-200 p-4 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                <Link href="/login" className="underline">
                  Sign in
                </Link>{" "}
                to leave a review.
              </p>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 text-lg font-semibold">More from {product.series}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <ProductCard key={r.id} product={r} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
