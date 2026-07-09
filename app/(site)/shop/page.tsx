import type { Metadata } from "next";
import Link from "next/link";
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

const SORT_OPTIONS = [
  { value: "name-asc", label: "Name" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
] as const;

function shopUrl(params: ShopSearchParams, overrides: Partial<Record<keyof ShopSearchParams, string | undefined>>) {
  const merged = { ...params, ...overrides };
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(merged)) {
    if (value) search.set(key, value);
  }
  const qs = search.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

function FilterFields({
  params,
  filterOptions,
  idPrefix,
}: {
  params: ShopSearchParams;
  filterOptions: Awaited<ReturnType<typeof getFilterOptions>>;
  idPrefix: string;
}) {
  return (
    <div className="space-y-6">
      <div>
        <label htmlFor={`${idPrefix}-q`} className="mb-1 block text-sm font-medium">
          Search
        </label>
        <input
          id={`${idPrefix}-q`}
          name="q"
          type="search"
          defaultValue={params.q ?? ""}
          placeholder="iPhone 15 Pro"
          className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
        />
      </div>

      <div>
        <label htmlFor={`${idPrefix}-series`} className="mb-1 block text-sm font-medium">
          Model series
        </label>
        <select
          id={`${idPrefix}-series`}
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
        <label htmlFor={`${idPrefix}-storage`} className="mb-1 block text-sm font-medium">
          Storage
        </label>
        <select
          id={`${idPrefix}-storage`}
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
        <label htmlFor={`${idPrefix}-colour`} className="mb-1 block text-sm font-medium">
          Colour
        </label>
        <select
          id={`${idPrefix}-colour`}
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
            aria-label="Minimum price"
            className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
          />
          <input
            name="maxPrice"
            type="number"
            min={0}
            defaultValue={params.maxPrice ?? ""}
            placeholder="Max"
            aria-label="Maximum price"
            className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
          />
        </div>
      </div>

      {params.sort && <input type="hidden" name="sort" value={params.sort} />}

      <button
        type="submit"
        className="w-full rounded-full bg-foreground py-2 text-sm font-medium text-background hover:opacity-80"
      >
        Apply filters
      </button>
    </div>
  );
}

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

  const activeFilters: { key: keyof ShopSearchParams; label: string }[] = [];
  if (params.q) activeFilters.push({ key: "q", label: `"${params.q}"` });
  if (params.series) activeFilters.push({ key: "series", label: params.series });
  if (params.storage) activeFilters.push({ key: "storage", label: formatStorage(Number(params.storage)) });
  if (params.colour) activeFilters.push({ key: "colour", label: params.colour });
  if (params.minPrice) activeFilters.push({ key: "minPrice", label: `From R${params.minPrice}` });
  if (params.maxPrice) activeFilters.push({ key: "maxPrice", label: `Up to R${params.maxPrice}` });

  const currentSort = params.sort || "name-asc";

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Shop iPhones</h1>
      <p className="mt-2 text-zinc-500 dark:text-zinc-400">
        Certified, warrantied white-box iPhones — every model we currently carry.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <div className="h-fit">
          <details className="group rounded-2xl border border-zinc-200 lg:hidden dark:border-zinc-800">
            <summary className="flex cursor-pointer list-none items-center justify-between p-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
              Filters
              {activeFilters.length > 0 && (
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs dark:bg-zinc-800">
                  {activeFilters.length} active
                </span>
              )}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-zinc-400 transition-transform group-open:rotate-180"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </summary>
            <form action="/shop" method="get" className="border-t border-zinc-200 p-4 dark:border-zinc-800">
              <FilterFields params={params} filterOptions={filterOptions} idPrefix="m" />
            </form>
          </details>

          <form
            action="/shop"
            method="get"
            className="hidden rounded-2xl border border-zinc-200 p-5 lg:block dark:border-zinc-800"
          >
            <FilterFields params={params} filterOptions={filterOptions} idPrefix="d" />
          </form>
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {products.length} model{products.length === 1 ? "" : "s"}
            </p>
            <div className="flex items-center gap-1 text-xs" aria-label="Sort by">
              <span className="mr-1 text-zinc-400 dark:text-zinc-500">Sort:</span>
              {SORT_OPTIONS.map((option) => (
                <Link
                  key={option.value}
                  href={shopUrl(params, { sort: option.value === "name-asc" ? undefined : option.value })}
                  aria-current={currentSort === option.value ? "true" : undefined}
                  className={`rounded-full px-3 py-1.5 transition-colors ${
                    currentSort === option.value
                      ? "bg-foreground font-medium text-background"
                      : "text-zinc-500 hover:bg-zinc-100 hover:text-foreground dark:text-zinc-400 dark:hover:bg-zinc-900"
                  }`}
                >
                  {option.label}
                </Link>
              ))}
            </div>
          </div>

          {activeFilters.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {activeFilters.map((filter) => (
                <Link
                  key={filter.key}
                  href={shopUrl(params, { [filter.key]: undefined })}
                  className="group flex items-center gap-1.5 rounded-full border border-zinc-200 py-1 pl-3 pr-2 text-xs text-zinc-600 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500"
                >
                  {filter.label}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="h-3 w-3 text-zinc-400 group-hover:text-foreground"
                    aria-hidden="true"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </Link>
              ))}
              <Link
                href="/shop"
                className="text-xs text-zinc-500 underline hover:text-foreground dark:text-zinc-400"
              >
                Clear all
              </Link>
            </div>
          )}

          {products.length === 0 ? (
            <div className="mt-4 flex flex-col items-center rounded-2xl border border-dashed border-zinc-300 px-6 py-16 text-center dark:border-zinc-700">
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
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <p className="mt-4 font-medium">No phones match those filters</p>
              <p className="mt-1 max-w-xs text-sm text-zinc-500 dark:text-zinc-400">
                Try widening your search or removing a filter or two.
              </p>
              <Link
                href="/shop"
                className="mt-6 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-80"
              >
                Clear all filters
              </Link>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
