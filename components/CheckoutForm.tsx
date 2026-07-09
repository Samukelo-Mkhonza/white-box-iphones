"use client";

import { useActionState } from "react";
import { createOrderAction, type CheckoutFormState } from "@/app/(site)/checkout/actions";

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

const inputClass =
  "w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700";
const labelClass = "mb-1 block text-sm font-medium";

function SectionHeading({ step, title }: { step: number; title: string }) {
  return (
    <h2 className="mb-4 flex items-center gap-2.5 font-semibold">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background">
        {step}
      </span>
      {title}
    </h2>
  );
}

export function CheckoutForm() {
  const [state, action, pending] = useActionState(createOrderAction, initialState);

  return (
    <form action={action} className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
        <SectionHeading step={1} title="Contact" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="nameFirst" className={labelClass}>
              First name
            </label>
            <input id="nameFirst" name="nameFirst" autoComplete="given-name" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="nameLast" className={labelClass}>
              Last name
            </label>
            <input id="nameLast" name="nameLast" autoComplete="family-name" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="phone" className={labelClass}>
              Phone <span className="font-normal text-zinc-400 dark:text-zinc-500">(optional)</span>
            </label>
            <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputClass} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
        <SectionHeading step={2} title="Shipping Address" />
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label htmlFor="line1" className={labelClass}>
              Street address
            </label>
            <input id="line1" name="line1" autoComplete="address-line1" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="line2" className={labelClass}>
              Apartment, suite, etc.{" "}
              <span className="font-normal text-zinc-400 dark:text-zinc-500">(optional)</span>
            </label>
            <input id="line2" name="line2" autoComplete="address-line2" className={inputClass} />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label htmlFor="city" className={labelClass}>
                City
              </label>
              <input id="city" name="city" autoComplete="address-level2" required className={inputClass} />
            </div>
            <div>
              <label htmlFor="province" className={labelClass}>
                Province
              </label>
              <select id="province" name="province" required defaultValue="" className={inputClass}>
                <option value="" disabled>
                  Select province
                </option>
                {PROVINCES.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="postalCode" className={labelClass}>
                Postal code
              </label>
              <input id="postalCode" name="postalCode" autoComplete="postal-code" required className={inputClass} />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
        <SectionHeading step={3} title="Payment" />

        {state.status === "error" && (
          <div
            role="alert"
            className="mb-4 flex items-start gap-2.5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-400"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-0.5 h-4 w-4 shrink-0"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
            {state.message}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-foreground py-3 text-sm font-medium text-background hover:opacity-80 disabled:opacity-50"
        >
          {pending ? "Redirecting to PayFast..." : "Pay with PayFast"}
        </button>
        <p className="mt-3 text-center text-xs text-zinc-500 dark:text-zinc-400">
          You&apos;ll be securely redirected to PayFast to complete payment.
        </p>
      </div>
    </form>
  );
}
