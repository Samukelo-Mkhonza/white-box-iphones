import { prisma } from "@/lib/prisma";
import type { Condition } from "@prisma/client";

const PRODUCT_INCLUDE = {
  brand: true,
  category: true,
  colourways: {
    include: {
      images: { orderBy: { position: "asc" as const } },
      variants: true,
    },
  },
} as const;

export type ProductWithRelations = Awaited<
  ReturnType<typeof prisma.product.findFirstOrThrow<{ include: typeof PRODUCT_INCLUDE }>>
>;

export type ProductSummary = {
  id: string;
  slug: string;
  name: string;
  series: string;
  minPriceCents: number;
  maxPriceCents: number;
  inStock: boolean;
  primaryImageUrl: string | null;
  colourCount: number;
  storageOptions: number[];
};

function summarize(product: ProductWithRelations): ProductSummary {
  const variants = product.colourways.flatMap((c) => c.variants);
  const prices = variants.map((v) => v.priceCents);
  const firstImage = product.colourways[0]?.images[0]?.url ?? null;
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    series: product.series,
    minPriceCents: prices.length ? Math.min(...prices) : 0,
    maxPriceCents: prices.length ? Math.max(...prices) : 0,
    inStock: variants.some((v) => v.stockQty > 0),
    primaryImageUrl: firstImage,
    colourCount: product.colourways.length,
    storageOptions: [...new Set(variants.map((v) => v.storageGb))].sort((a, b) => a - b),
  };
}

export async function getAllProductsWithRelations(): Promise<ProductWithRelations[]> {
  return prisma.product.findMany({
    where: { isPublished: true },
    include: PRODUCT_INCLUDE,
    orderBy: [{ series: "asc" }, { name: "asc" }],
  });
}

export async function getFeaturedProducts(limit = 4): Promise<ProductSummary[]> {
  const products = await getAllProductsWithRelations();
  // One representative model per series (the non-Pro/base model reads as
  // the most "featured" entry point into that series), newest series first.
  const seenSeries = new Set<string>();
  const featured: ProductSummary[] = [];
  for (const product of [...products].reverse()) {
    if (seenSeries.has(product.series)) continue;
    seenSeries.add(product.series);
    featured.push(summarize(product));
    if (featured.length >= limit) break;
  }
  return featured.reverse();
}

export type ShopFilters = {
  search?: string;
  series?: string;
  storage?: number;
  colour?: string;
  minPriceCents?: number;
  maxPriceCents?: number;
  sort?: "price-asc" | "price-desc" | "name-asc";
};

export async function listProductSummaries(filters: ShopFilters = {}): Promise<ProductSummary[]> {
  const products = await getAllProductsWithRelations();
  let summaries = products.map(summarize);

  if (filters.search) {
    const q = filters.search.toLowerCase();
    summaries = summaries.filter((p) => p.name.toLowerCase().includes(q));
  }
  if (filters.series) {
    summaries = summaries.filter((p) => p.series === filters.series);
  }
  if (filters.storage) {
    summaries = summaries.filter((p) => p.storageOptions.includes(filters.storage!));
  }
  if (filters.colour) {
    const idsWithColour = new Set(
      products
        .filter((p) => p.colourways.some((c) => c.name === filters.colour))
        .map((p) => p.id)
    );
    summaries = summaries.filter((p) => idsWithColour.has(p.id));
  }
  if (filters.minPriceCents !== undefined) {
    summaries = summaries.filter((p) => p.maxPriceCents >= filters.minPriceCents!);
  }
  if (filters.maxPriceCents !== undefined) {
    summaries = summaries.filter((p) => p.minPriceCents <= filters.maxPriceCents!);
  }

  switch (filters.sort) {
    case "price-asc":
      summaries.sort((a, b) => a.minPriceCents - b.minPriceCents);
      break;
    case "price-desc":
      summaries.sort((a, b) => b.minPriceCents - a.minPriceCents);
      break;
    default:
      summaries.sort((a, b) => a.name.localeCompare(b.name));
  }

  return summaries;
}

export async function getFilterOptions() {
  const products = await getAllProductsWithRelations();
  const seriesList = [...new Set(products.map((p) => p.series))];
  const storageList = [
    ...new Set(products.flatMap((p) => p.colourways.flatMap((c) => c.variants.map((v) => v.storageGb)))),
  ].sort((a, b) => a - b);
  const colourList = [...new Set(products.flatMap((p) => p.colourways.map((c) => c.name)))].sort();
  const prices = products.flatMap((p) => p.colourways.flatMap((c) => c.variants.map((v) => v.priceCents)));
  return {
    seriesList,
    storageList,
    colourList,
    minPriceCents: prices.length ? Math.min(...prices) : 0,
    maxPriceCents: prices.length ? Math.max(...prices) : 0,
  };
}

export async function getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  return prisma.product.findUnique({
    where: { slug, isPublished: true },
    include: PRODUCT_INCLUDE,
  });
}

export async function getRelatedProducts(product: ProductWithRelations, limit = 4): Promise<ProductSummary[]> {
  const products = await getAllProductsWithRelations();
  return products
    .filter((p) => p.series === product.series && p.id !== product.id)
    .slice(0, limit)
    .map(summarize);
}

export function parseSpecifications(product: { specifications: string }): Record<string, string> {
  try {
    return JSON.parse(product.specifications);
  } catch {
    return {};
  }
}

export function conditionLabel(condition: Condition): string {
  switch (condition) {
    case "EXCELLENT":
      return "Excellent";
    case "VERY_GOOD":
      return "Very Good";
    case "GOOD":
      return "Good";
  }
}

export function formatStorage(gb: number): string {
  return gb >= 1024 ? `${gb / 1024} TB` : `${gb} GB`;
}
