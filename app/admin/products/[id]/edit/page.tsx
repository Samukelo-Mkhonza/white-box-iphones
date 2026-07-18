import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductForAdmin } from "@/lib/admin";
import { conditionLabel, formatStorage } from "@/lib/products";
import { formatZAR } from "@/lib/format";
import { EditProductForm } from "@/components/admin/EditProductForm";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import {
  deleteProductAction,
  createColourwayAction,
  deleteColourwayAction,
  uploadColourwayImageAction,
  deleteImageAction,
  createVariantAction,
  updateVariantAction,
  deleteVariantAction,
} from "@/app/admin/products/actions";

export const metadata: Metadata = { title: "Admin · Edit Product" };

const CONDITIONS: { value: string; label: string }[] = [
  { value: "EXCELLENT", label: "Excellent" },
  { value: "VERY_GOOD", label: "Very Good" },
  { value: "GOOD", label: "Good" },
];

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductForAdmin(id);
  if (!product) notFound();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{product.name}</h1>
        <form action={deleteProductAction.bind(null, product.id)}>
          <ConfirmSubmitButton
            confirmMessage={`Delete "${product.name}" and all its colours, variants and images? This cannot be undone.`}
            className="rounded-full border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
          >
            Delete Product
          </ConfirmSubmitButton>
        </form>
      </div>

      <div className="mt-6">
        <EditProductForm
          productId={product.id}
          name={product.name}
          series={product.series}
          description={product.description}
          specifications={product.specifications}
          isPublished={product.isPublished}
        />
      </div>

      <div className="mt-12">
        <h2 className="mb-4 text-lg font-semibold">Colours &amp; Variants</h2>

        <div className="space-y-6">
          {product.colourways.map((colourway) => (
            <div key={colourway.id} className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="h-6 w-6 rounded-full border border-zinc-300 dark:border-zinc-700"
                    style={{ backgroundColor: colourway.hexCode }}
                  />
                  <p className="font-medium">
                    {colourway.name} <span className="text-zinc-400">{colourway.hexCode}</span>
                  </p>
                </div>
                <form action={deleteColourwayAction.bind(null, product.id, colourway.id)}>
                  <ConfirmSubmitButton
                    confirmMessage={`Delete the ${colourway.name} colourway and its variants/images?`}
                    className="text-xs text-red-600 underline dark:text-red-400"
                  >
                    Delete colour
                  </ConfirmSubmitButton>
                </form>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                {colourway.images.map((image) => (
                  <div key={image.id} className="relative">
                    <div className="relative h-20 w-20 overflow-hidden rounded-lg">
                      <Image src={image.url} alt={image.altText} fill unoptimized className="object-contain p-1" />
                    </div>
                    <form action={deleteImageAction.bind(null, product.id, image.id)} className="mt-1 text-center">
                      <button type="submit" className="text-xs text-red-600 underline dark:text-red-400">
                        Remove
                      </button>
                    </form>
                  </div>
                ))}
                <form
                  action={uploadColourwayImageAction.bind(null, product.id, colourway.id)}
                  className="flex h-20 w-40 flex-col justify-center gap-1 rounded-lg border border-dashed border-zinc-300 p-2 dark:border-zinc-700"
                >
                  <input type="file" name="image" accept="image/*" required className="text-xs" />
                  <button type="submit" className="text-xs underline">
                    Upload photo
                  </button>
                </form>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[560px] text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      <th className="py-2 pr-3">Storage</th>
                      <th className="py-2 pr-3">Condition</th>
                      <th className="py-2 pr-3">Price (R)</th>
                      <th className="py-2 pr-3">Stock</th>
                      <th className="py-2 pr-3">Battery %</th>
                      <th className="py-2 pr-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {colourway.variants.map((variant) => (
                      <tr key={variant.id}>
                        <td className="py-2 pr-3">{formatStorage(variant.storageGb)}</td>
                        <td className="py-2 pr-3">{conditionLabel(variant.condition)}</td>
                        <td className="py-2 pr-3">
                          <form
                            action={updateVariantAction.bind(null, product.id, variant.id)}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="number"
                              name="priceRand"
                              step="1"
                              min="1"
                              defaultValue={Math.round(variant.priceCents / 100)}
                              className="w-24 rounded-md border border-zinc-200 bg-transparent px-2 py-1 text-sm dark:border-zinc-700"
                            />
                            <input
                              type="number"
                              name="stockQty"
                              min="0"
                              defaultValue={variant.stockQty}
                              className="w-16 rounded-md border border-zinc-200 bg-transparent px-2 py-1 text-sm dark:border-zinc-700"
                              aria-label="Stock"
                            />
                            <input
                              type="number"
                              name="batteryHealthPct"
                              min="1"
                              max="100"
                              defaultValue={variant.batteryHealthPct}
                              className="w-16 rounded-md border border-zinc-200 bg-transparent px-2 py-1 text-sm dark:border-zinc-700"
                              aria-label="Battery %"
                            />
                            <button
                              type="submit"
                              className="rounded-md border border-zinc-200 px-2 py-1 text-xs hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
                            >
                              Save
                            </button>
                          </form>
                        </td>
                        <td className="py-2 pr-3 text-zinc-500 dark:text-zinc-400">
                          {formatZAR(variant.priceCents)}
                        </td>
                        <td className="py-2 pr-3 text-zinc-500 dark:text-zinc-400">{variant.stockQty}</td>
                        <td className="py-2 pr-3">
                          <form action={deleteVariantAction.bind(null, product.id, variant.id)}>
                            <button type="submit" className="text-xs text-red-600 underline dark:text-red-400">
                              Delete
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <form
                action={createVariantAction.bind(null, product.id)}
                className="mt-4 flex flex-wrap items-end gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-800"
              >
                <input type="hidden" name="colourwayId" value={colourway.id} />
                <div>
                  <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Storage (GB)</label>
                  <input
                    type="number"
                    name="storageGb"
                    required
                    placeholder="128"
                    className="w-24 rounded-md border border-zinc-200 bg-transparent px-2 py-1.5 text-sm dark:border-zinc-700"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Condition</label>
                  <select
                    name="condition"
                    required
                    className="rounded-md border border-zinc-200 bg-transparent px-2 py-1.5 text-sm dark:border-zinc-700"
                  >
                    {CONDITIONS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Price (R)</label>
                  <input
                    type="number"
                    name="priceRand"
                    required
                    min="1"
                    placeholder="9999"
                    className="w-24 rounded-md border border-zinc-200 bg-transparent px-2 py-1.5 text-sm dark:border-zinc-700"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Stock</label>
                  <input
                    type="number"
                    name="stockQty"
                    required
                    min="0"
                    placeholder="10"
                    className="w-20 rounded-md border border-zinc-200 bg-transparent px-2 py-1.5 text-sm dark:border-zinc-700"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Battery %</label>
                  <input
                    type="number"
                    name="batteryHealthPct"
                    required
                    min="1"
                    max="100"
                    placeholder="90"
                    className="w-20 rounded-md border border-zinc-200 bg-transparent px-2 py-1.5 text-sm dark:border-zinc-700"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background hover:opacity-80"
                >
                  Add Variant
                </button>
              </form>
            </div>
          ))}
        </div>

        <form
          action={createColourwayAction.bind(null, product.id)}
          className="mt-6 flex flex-wrap items-end gap-2 rounded-2xl border border-dashed border-zinc-300 p-5 dark:border-zinc-700"
        >
          <div>
            <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Colour name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Midnight"
              className="rounded-md border border-zinc-200 bg-transparent px-2 py-1.5 text-sm dark:border-zinc-700"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Hex code</label>
            <input
              type="text"
              name="hexCode"
              required
              placeholder="#1d1d1f"
              className="w-28 rounded-md border border-zinc-200 bg-transparent px-2 py-1.5 text-sm dark:border-zinc-700"
            />
          </div>
          <button
            type="submit"
            className="rounded-full border border-foreground px-4 py-2 text-xs font-medium hover:bg-foreground hover:text-background"
          >
            Add Colour
          </button>
        </form>
      </div>
    </div>
  );
}
