"use client";

import { useActionState } from "react";
import { createProductAction, type FormState } from "@/app/admin/products/actions";

const initialState: FormState = { status: "idle" };

export function NewProductForm({
  brands,
  categories,
}: {
  brands: { id: string; name: string }[];
  categories: { id: string; name: string }[];
}) {
  const [state, action, pending] = useActionState(createProductAction, initialState);

  return (
    <form action={action} className="max-w-xl space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          placeholder="iPhone 17"
          className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
        />
      </div>
      <div>
        <label htmlFor="series" className="mb-1 block text-sm font-medium">
          Series
        </label>
        <input
          id="series"
          name="series"
          required
          placeholder="iPhone 17 Series"
          className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="brandId" className="mb-1 block text-sm font-medium">
            Brand
          </label>
          <select
            id="brandId"
            name="brandId"
            required
            className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
          >
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="categoryId" className="mb-1 block text-sm font-medium">
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          required
          className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
        />
      </div>
      <div>
        <label htmlFor="specifications" className="mb-1 block text-sm font-medium">
          Specifications (JSON)
        </label>
        <textarea
          id="specifications"
          name="specifications"
          rows={4}
          defaultValue={`{\n  "screen": "",\n  "chip": "",\n  "camera": "",\n  "battery": ""\n}`}
          className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 font-mono text-xs dark:border-zinc-700"
        />
      </div>

      {state.status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background hover:opacity-80 disabled:opacity-50"
      >
        {pending ? "Creating..." : "Create Product"}
      </button>
    </form>
  );
}
