"use client";

import { useActionState } from "react";
import { updateOrderAction, type FormState } from "@/app/admin/orders/actions";
import type { OrderStatus } from "@prisma/client";

const STATUSES: OrderStatus[] = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

const initialState: FormState = { status: "idle" };

export function OrderStatusForm({
  orderNumber,
  currentStatus,
  currentTrackingNumber,
}: {
  orderNumber: string;
  currentStatus: OrderStatus;
  currentTrackingNumber: string | null;
}) {
  const boundAction = updateOrderAction.bind(null, orderNumber);
  const [state, action, pending] = useActionState(boundAction, initialState);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="status" className="mb-1 block text-sm font-medium">
          Order status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={currentStatus}
          className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="trackingNumber" className="mb-1 block text-sm font-medium">
          Tracking number
        </label>
        <input
          id="trackingNumber"
          name="trackingNumber"
          defaultValue={currentTrackingNumber ?? ""}
          placeholder="e.g. CR123456789ZA"
          className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
        />
      </div>

      {state.status === "idle" && state.message && (
        <p className="text-sm text-emerald-600 dark:text-emerald-400">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background hover:opacity-80 disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
