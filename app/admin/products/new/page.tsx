import type { Metadata } from "next";
import { getBrandsAndCategories } from "@/lib/admin";
import { NewProductForm } from "@/components/admin/NewProductForm";

export const metadata: Metadata = { title: "Admin · Add Product" };

export default async function NewProductPage() {
  const { brands, categories } = await getBrandsAndCategories();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Add Product</h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        Add colours, storage options and pricing after creating the product.
      </p>
      <div className="mt-6">
        <NewProductForm brands={brands} categories={categories} />
      </div>
    </div>
  );
}
