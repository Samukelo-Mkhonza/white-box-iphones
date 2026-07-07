import type { Metadata } from "next";
import Link from "next/link";
import { getAllProductsForAdmin } from "@/lib/admin";
import { formatZAR } from "@/lib/format";

export const metadata: Metadata = { title: "Admin · Products" };

export default async function AdminProductsPage() {
  const products = await getAllProductsForAdmin();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-80"
        >
          Add Product
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              <th className="p-3">Name</th>
              <th className="p-3">Series</th>
              <th className="p-3">Price range</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {products.map((product) => {
              const variants = product.colourways.flatMap((c) => c.variants);
              const prices = variants.map((v) => v.priceCents);
              const totalStock = variants.reduce((sum, v) => sum + v.stockQty, 0);
              return (
                <tr key={product.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900">
                  <td className="p-3 font-medium">{product.name}</td>
                  <td className="p-3 text-zinc-500 dark:text-zinc-400">{product.series}</td>
                  <td className="p-3">
                    {prices.length ? `${formatZAR(Math.min(...prices))} – ${formatZAR(Math.max(...prices))}` : "—"}
                  </td>
                  <td className="p-3">{totalStock}</td>
                  <td className="p-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        product.isPublished
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                          : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}
                    >
                      {product.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Link href={`/admin/products/${product.id}/edit`} className="text-sm underline">
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
