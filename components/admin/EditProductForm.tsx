"use client";

import { useActionState } from "react";
import { updateProductAction, type FormState } from "@/app/admin/products/actions";

const initialState: FormState = { status: "idle" };

export function EditProductForm({
  productId,
  name,
  series,
  description,
  specifications,
  isPublished,
}: {
  productId: string;
  name: string;
  series: string;
  description: string;
  specifications: string;
  isPublished: boolean;
}) {
  const boundAction = updateProductAction.bind(null, productId);
  const [state, action, pending] = useActionState(boundAction, initialState);

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
          defaultValue={name}
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
          defaultValue={series}
          className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
        />
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
          defaultValue={description}
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
          rows={5}
          defaultValue={specifications}
          className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 font-mono text-xs dark:border-zinc-700"
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isPublished" defaultChecked={isPublished} />
        Published (visible in shop)
      </label>

      {state.status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400">{state.message}</p>
      )}
      {state.status === "idle" && state.message && (
        <p className="text-sm text-emerald-600 dark:text-emerald-400">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background hover:opacity-80 disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
