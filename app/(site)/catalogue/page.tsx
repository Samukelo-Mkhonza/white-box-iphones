import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllProductsWithRelations, formatStorage } from "@/lib/products";
import { formatZAR } from "@/lib/format";

export const metadata: Metadata = {
  title: "Catalogue",
  description: "Every White Box iPhone model, colour and storage option in one place.",
};

export default async function CataloguePage() {
  const products = await getAllProductsWithRelations();
  const seriesGroups = new Map<string, typeof products>();
  for (const product of products) {
    const group = seriesGroups.get(product.series) ?? [];
    group.push(product);
    seriesGroups.set(product.series, group);
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Full Catalogue</h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Every model, colourway and storage size we carry, in one printable list.
          </p>
        </div>
        <a
          href="/catalogue/download"
          className="shrink-0 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-80"
        >
          Download PDF
        </a>
      </div>

      {[...seriesGroups.entries()].map(([series, items]) => (
        <section key={series} className="mt-12">
          <h2 className="mb-4 text-xl font-semibold tracking-tight">{series}</h2>
          <div className="divide-y divide-zinc-200 rounded-2xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
            {items.map((product) => {
              const variants = product.colourways.flatMap((c) => c.variants);
              const prices = variants.map((v) => v.priceCents);
              const storageOptions = [...new Set(variants.map((v) => v.storageGb))].sort((a, b) => a - b);
              const image = product.colourways[0]?.images[0];
              return (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="flex flex-col gap-4 p-4 hover:bg-zinc-50 sm:flex-row sm:items-center dark:hover:bg-zinc-900"
                >
                  {image && (
                    <div className="relative h-20 w-20 shrink-0 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                      <Image src={image.url} alt={image.altText} fill unoptimized className="object-contain p-2" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {product.colourways.map((c) => c.name).join(", ")}
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {storageOptions.map(formatStorage).join(" / ")}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {formatZAR(Math.min(...prices))} &ndash; {formatZAR(Math.max(...prices))}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
