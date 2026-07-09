import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Policies" };

const POLICIES = [
  { href: "/policies/privacy", label: "Privacy Policy", body: "How we collect and use your information." },
  { href: "/policies/returns", label: "Returns Policy", body: "Our 14-day return window and process." },
  { href: "/policies/warranty", label: "Warranty", body: "What's covered under our 12-month warranty." },
  { href: "/policies/shipping", label: "Shipping Policy", body: "Delivery areas, timing and fees." },
  { href: "/policies/terms", label: "Terms of Service", body: "The terms that apply to every order." },
];

export default function PoliciesIndexPage() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Policies</h1>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {POLICIES.map((policy) => (
          <Link
            key={policy.href}
            href={policy.href}
            className="rounded-2xl border border-zinc-200 p-5 hover:shadow-lg dark:border-zinc-800"
          >
            <p className="font-semibold">{policy.label}</p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{policy.body}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
