"use client";

import { useActionState } from "react";
import { createDiscountCodeAction, type FormState } from "@/app/admin/discounts/actions";

const initialState: FormState = { status: "idle" };

export function NewDiscountForm() {
  const [state, action, pending] = useActionState(createDiscountCodeAction, initialState);

  return (
    <form action={action} className="flex flex-wrap items-end gap-3">
      <div>
        <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Code</label>
        <input
          name="code"
          required
          placeholder="SUMMER10"
          className="w-32 rounded-md border border-zinc-200 bg-transparent px-2 py-1.5 text-sm uppercase dark:border-zinc-700"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Type</label>
        <select
          name="type"
          className="rounded-md border border-zinc-200 bg-transparent px-2 py-1.5 text-sm dark:border-zinc-700"
        >
          <option value="PERCENTAGE">Percentage</option>
          <option value="FIXED">Fixed (R)</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Value</label>
        <input
          name="value"
          type="number"
          required
          min="1"
          placeholder="10"
          className="w-24 rounded-md border border-zinc-200 bg-transparent px-2 py-1.5 text-sm dark:border-zinc-700"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Usage limit</label>
        <input
          name="usageLimit"
          type="number"
          min="1"
          placeholder="Unlimited"
          className="w-28 rounded-md border border-zinc-200 bg-transparent px-2 py-1.5 text-sm dark:border-zinc-700"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Expires</label>
        <input
          name="expiresAt"
          type="date"
          className="rounded-md border border-zinc-200 bg-transparent px-2 py-1.5 text-sm dark:border-zinc-700"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background hover:opacity-80 disabled:opacity-50"
      >
        {pending ? "Creating..." : "Create Code"}
      </button>

      {state.status === "error" && (
        <p className="w-full text-sm text-red-600 dark:text-red-400">{state.message}</p>
      )}
      {state.status === "idle" && state.message && (
        <p className="w-full text-sm text-emerald-600 dark:text-emerald-400">{state.message}</p>
      )}
    </form>
  );
}
