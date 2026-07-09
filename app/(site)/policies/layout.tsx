import Link from "next/link";

const POLICY_NAV = [
  { href: "/policies/privacy", label: "Privacy Policy" },
  { href: "/policies/returns", label: "Returns Policy" },
  { href: "/policies/warranty", label: "Warranty" },
  { href: "/policies/shipping", label: "Shipping Policy" },
  { href: "/policies/terms", label: "Terms of Service" },
];

export default function PoliciesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[200px_1fr]">
        <nav className="space-y-1 text-sm">
          {POLICY_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-3 py-2 text-zinc-500 hover:bg-zinc-50 hover:text-foreground dark:text-zinc-400 dark:hover:bg-zinc-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <article className="max-w-none">{children}</article>
      </div>
    </div>
  );
}
