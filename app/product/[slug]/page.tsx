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
import { ProductVariantPicker } from "@/components/ProductVariantPicker";
import { ProductCard } from "@/components/ProductCard";

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

  const [related, settings] = await Promise.all([
    getRelatedProducts(product),
    getStoreSettings(),
  ]);
  const specs = parseSpecifications(product);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <nav className="mb-8 text-sm text-zinc-500 dark:text-zinc-400">
        <Link href="/shop" className="hover:text-foreground">
          Shop
        </Link>{" "}
        / <span>{product.series}</span> / <span className="text-foreground">{product.name}</span>
      </nav>

      <ProductVariantPicker
        productName={product.name}
        colourways={product.colourways}
        minDeliveryDays={settings.minDeliveryDays}
        maxDeliveryDays={settings.maxDeliveryDays}
      />

      <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-lg font-semibold">Description</h2>
          <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{product.description}</p>
        </div>
        <div>
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
