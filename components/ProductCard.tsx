import Image from "next/image";
import Link from "next/link";
import { formatZAR } from "@/lib/format";
import type { ProductSummary } from "@/lib/products";
import { formatStorage } from "@/lib/products";

export function ProductCard({ product }: { product: ProductSummary }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 transition-shadow hover:shadow-lg dark:border-zinc-800"
    >
      <div className="relative aspect-square">
        {product.primaryImageUrl && (
          <Image
            src={product.primaryImageUrl}
            alt={product.name}
            fill
            unoptimized
            className="object-contain p-6 transition-transform group-hover:scale-105"
          />
        )}
        {!product.inStock && (
          <span className="absolute right-3 top-3 rounded-full bg-zinc-900 px-2.5 py-0.5 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
            Out of stock
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{product.series}</p>
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {product.colourCount} colours &middot; {product.storageOptions.map(formatStorage).join(" / ")}
        </p>
        <p className="mt-2 text-lg font-bold">From {formatZAR(product.minPriceCents)}</p>
      </div>
    </Link>
  );
}
