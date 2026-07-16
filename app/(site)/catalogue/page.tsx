import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllProductsWithRelations, formatStorage, conditionLabel } from "@/lib/products";
import { formatZAR } from "@/lib/format";
import { slugify } from "@/lib/slug";
import { Breadcrumbs } from "@/components/Breadcrumbs";

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
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Catalogue" }]} />
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="eyebrow text-zinc-500 dark:text-zinc-400">The complete range</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tighter sm:text-5xl">Full Catalogue</h1>
          <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400">
            Every model, colourway and storage size we carry, in one printable list.
          </p>
        </div>
        <a
          href="/catalogue/download"
          className="flex shrink-0 items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-80 print:hidden"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M12 3v12" />
            <path d="M7 10l5 5 5-5" />
            <path d="M4 21h16" />
          </svg>
          Download PDF
        </a>
      </div>

      <nav aria-label="Jump to series" className="mt-6 flex flex-wrap gap-2 print:hidden">
        {[...seriesGroups.keys()].map((series) => (
          <a
            key={series}
            href={`#${slugify(series)}`}
            className="rounded-full border border-zinc-200 px-4 py-1.5 text-sm text-zinc-600 transition-colors hover:border-zinc-400 hover:text-foreground dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500"
          >
            {series}
          </a>
        ))}
      </nav>

      {[...seriesGroups.entries()].map(([series, items]) => (
        <section key={series} id={slugify(series)} className="mt-12 scroll-mt-24">
          <div className="mb-4 flex items-baseline gap-3">
            <h2 className="text-xl font-semibold tracking-tight">{series}</h2>
            <span className="text-sm text-zinc-400 dark:text-zinc-500">
              {items.length} model{items.length === 1 ? "" : "s"}
            </span>
          </div>
          <div className="divide-y divide-zinc-200 rounded-2xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
            {items.map((product) => {
              const variants = product.colourways.flatMap((c) => c.variants);
              const prices = variants.map((v) => v.priceCents);
              const storageOptions = [...new Set(variants.map((v) => v.storageGb))].sort((a, b) => a - b);
              const conditions = [...new Set(variants.map((v) => v.condition))];
              const image = product.colourways[0]?.images[0];
              return (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="flex flex-col gap-4 p-4 transition-colors hover:bg-zinc-50 sm:flex-row sm:items-center dark:hover:bg-zinc-900"
                >
                  {image && (
                    <div className="relative h-20 w-20 shrink-0 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                      <Image src={image.url} alt={image.altText} fill unoptimized className="object-contain p-2" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{product.name}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400">
                      <span className="flex items-center gap-1.5">
                        {product.colourways.map((colourway) => (
                          <span
                            key={colourway.id}
                            title={colourway.name}
                            style={{ backgroundColor: colourway.hexCode }}
                            className="h-3.5 w-3.5 rounded-full border border-zinc-300 dark:border-zinc-600"
                          />
                        ))}
                        <span className="ml-0.5">
                          {product.colourways.length} colour{product.colourways.length === 1 ? "" : "s"}
                        </span>
                      </span>
                      <span aria-hidden="true">&middot;</span>
                      <span>{storageOptions.map(formatStorage).join(" / ")}</span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                      Condition: {conditions.map(conditionLabel).join(", ")}
                    </p>
                  </div>
                  <p className="shrink-0 font-semibold">
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
