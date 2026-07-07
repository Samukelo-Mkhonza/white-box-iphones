"use client";

import { useActionState } from "react";
import { createOrderAction, type CheckoutFormState } from "@/app/checkout/actions";

const PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
  "Western Cape",
];

const initialState: CheckoutFormState = { status: "idle" };

export function CheckoutForm() {
  const [state, action, pending] = useActionState(createOrderAction, initialState);

  return (
    <form action={action} className="space-y-6">
      <div>
        <h2 className="mb-3 font-semibold">Contact</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            name="nameFirst"
            placeholder="First name"
            required
            className="rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
          />
          <input
            name="nameLast"
            placeholder="Last name"
            required
            className="rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
          />
          <input
            name="phone"
            type="tel"
            placeholder="Phone (optional)"
            className="rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
          />
        </div>
      </div>

      <div>
        <h2 className="mb-3 font-semibold">Shipping Address</h2>
        <div className="grid grid-cols-1 gap-3">
          <input
            name="line1"
            placeholder="Street address"
            required
            className="rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
          />
          <input
            name="line2"
            placeholder="Apartment, suite, etc. (optional)"
            className="rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <input
              name="city"
              placeholder="City"
              required
              className="rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
            />
            <select
              name="province"
              required
              defaultValue=""
              className="rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
            >
              <option value="" disabled>
                Province
              </option>
              {PROVINCES.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
            <input
              name="postalCode"
              placeholder="Postal code"
              required
              className="rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
            />
          </div>
        </div>
      </div>

      {state.status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-foreground py-3 text-sm font-medium text-background hover:opacity-80 disabled:opacity-50"
      >
        {pending ? "Redirecting to PayFast..." : "Pay with PayFast"}
      </button>
      <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
        You&apos;ll be securely redirected to PayFast to complete payment.
      </p>
    </form>
  );
}
