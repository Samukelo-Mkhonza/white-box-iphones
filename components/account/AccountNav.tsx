"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/(site)/account/actions";

const LINKS = [
  {
    href: "/account",
    label: "Overview",
    exact: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0" aria-hidden="true">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
      </svg>
    ),
  },
  {
    href: "/account/orders",
    label: "Order History",
    exact: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0" aria-hidden="true">
        <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" />
        <path d="M3 8l9 5 9-5" />
        <path d="M12 13v8" />
      </svg>
    ),
  },
  {
    href: "/account/wishlist",
    label: "Wishlist",
    exact: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0" aria-hidden="true">
        <path d="M12 20.5l-7.6-7.8a4.8 4.8 0 010-6.7 4.6 4.6 0 016.6 0l1 1 1-1a4.6 4.6 0 016.6 0 4.8 4.8 0 010 6.7L12 20.5z" />
      </svg>
    ),
  },
];

export function AccountNav({ firstName }: { firstName: string }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Account" className="text-sm">
      <p className="mb-3 hidden px-3 text-xs font-medium uppercase tracking-wide text-zinc-400 lg:block">
        Hi, {firstName}
      </p>
      <div className="-mx-6 flex gap-1 overflow-x-auto px-6 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
        {LINKS.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2 outline-offset-2 transition-colors ${
                active
                  ? "bg-zinc-100 font-medium text-foreground dark:bg-zinc-900"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-foreground dark:text-zinc-400 dark:hover:bg-zinc-900"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          );
        })}
        <form action={logoutAction} className="shrink-0 lg:mt-2 lg:border-t lg:border-zinc-200 lg:pt-2 lg:dark:border-zinc-800">
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-red-600 outline-offset-2 transition-colors hover:bg-zinc-50 dark:text-red-400 dark:hover:bg-zinc-900"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0" aria-hidden="true">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <path d="M16 17l5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
            Log out
          </button>
        </form>
      </div>
    </nav>
  );
}
