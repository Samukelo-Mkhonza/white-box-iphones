import type { Metadata } from "next";
import { getFilterOptions, listProductSummaries, formatStorage } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse certified white-box iPhones from the 13, 14, 15 and 16 series.",
};

type ShopSearchParams = {
  q?: string;
  series?: string;
  storage?: string;
  colour?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<ShopSearchParams>;
}) {
  const params = await searchParams;
  const [products, filterOptions] = await Promise.all([
    listProductSummaries({
      search: params.q,
      series: params.series || undefined,
      storage: params.storage ? Number(params.storage) : undefined,
      colour: params.colour || undefined,
      minPriceCents: params.minPrice ? Number(params.minPrice) * 100 : undefined,
      maxPriceCents: params.maxPrice ? Number(params.maxPrice) * 100 : undefined,
      sort: (params.sort as "price-asc" | "price-desc" | "name-asc") || undefined,
    }),
    getFilterOptions(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Shop iPhones</h1>
      <p className="mt-2 text-zinc-500 dark:text-zinc-400">
        {products.length} model{products.length === 1 ? "" : "s"} available.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <form
          action="/shop"
          method="get"
          className="h-fit space-y-6 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800"
        >
          <div>
            <label htmlFor="q" className="mb-1 block text-sm font-medium">
              Search
            </label>
            <input
              id="q"
              name="q"
              type="search"
              defaultValue={params.q ?? ""}
              placeholder="iPhone 15 Pro"
              className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
            />
          </div>

          <div>
            <label htmlFor="series" className="mb-1 block text-sm font-medium">
              Model series
            </label>
            <select
              id="series"
              name="series"
              defaultValue={params.series ?? ""}
              className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
            >
              <option value="">All series</option>
              {filterOptions.seriesList.map((series) => (
                <option key={series} value={series}>
                  {series}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="storage" className="mb-1 block text-sm font-medium">
              Storage
            </label>
            <select
              id="storage"
              name="storage"
              defaultValue={params.storage ?? ""}
              className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
            >
              <option value="">Any storage</option>
              {filterOptions.storageList.map((gb) => (
                <option key={gb} value={gb}>
                  {formatStorage(gb)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="colour" className="mb-1 block text-sm font-medium">
              Colour
            </label>
            <select
              id="colour"
              name="colour"
              defaultValue={params.colour ?? ""}
              className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
            >
              <option value="">Any colour</option>
              {filterOptions.colourList.map((colour) => (
                <option key={colour} value={colour}>
                  {colour}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="mb-1 block text-sm font-medium">Price (ZAR)</span>
            <div className="flex gap-2">
              <input
                name="minPrice"
                type="number"
                min={0}
                defaultValue={params.minPrice ?? ""}
                placeholder="Min"
                className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
              />
              <input
                name="maxPrice"
                type="number"
                min={0}
                defaultValue={params.maxPrice ?? ""}
                placeholder="Max"
                className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
              />
            </div>
          </div>

          <div>
            <label htmlFor="sort" className="mb-1 block text-sm font-medium">
              Sort by
            </label>
            <select
              id="sort"
              name="sort"
              defaultValue={params.sort ?? ""}
              className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
            >
              <option value="name-asc">Name</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-foreground py-2 text-sm font-medium text-background hover:opacity-80"
          >
            Apply filters
          </button>
          {(params.q || params.series || params.storage || params.colour || params.minPrice || params.maxPrice) && (
            <a href="/shop" className="block text-center text-xs text-zinc-500 hover:text-foreground dark:text-zinc-400">
              Clear all filters
            </a>
          )}
        </form>

        <div>
          {products.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-zinc-300 p-12 text-center text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
              No phones match those filters. Try widening your search.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
