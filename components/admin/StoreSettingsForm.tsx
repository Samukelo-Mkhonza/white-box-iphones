"use client";

import { useActionState } from "react";
import { updateStoreSettingsAction, type FormState } from "@/app/admin/settings/actions";

const initialState: FormState = { status: "idle" };

export function StoreSettingsForm({
  flatShippingFeeCents,
  minDeliveryDays,
  maxDeliveryDays,
}: {
  flatShippingFeeCents: number;
  minDeliveryDays: number;
  maxDeliveryDays: number;
}) {
  const [state, action, pending] = useActionState(updateStoreSettingsAction, initialState);

  return (
    <form action={action} className="max-w-sm space-y-4">
      <div>
        <label htmlFor="flatShippingFeeRand" className="mb-1 block text-sm font-medium">
          Flat shipping fee (R)
        </label>
        <input
          id="flatShippingFeeRand"
          name="flatShippingFeeRand"
          type="number"
          min="0"
          step="1"
          defaultValue={Math.round(flatShippingFeeCents / 100)}
          className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="minDeliveryDays" className="mb-1 block text-sm font-medium">
            Min delivery (days)
          </label>
          <input
            id="minDeliveryDays"
            name="minDeliveryDays"
            type="number"
            min="1"
            defaultValue={minDeliveryDays}
            className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
          />
        </div>
        <div>
          <label htmlFor="maxDeliveryDays" className="mb-1 block text-sm font-medium">
            Max delivery (days)
          </label>
          <input
            id="maxDeliveryDays"
            name="maxDeliveryDays"
            type="number"
            min="1"
            defaultValue={maxDeliveryDays}
            className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
          />
        </div>
      </div>

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
        {pending ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}
