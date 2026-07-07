"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/reviews", label: "Reviews" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-background/95 backdrop-blur dark:border-zinc-800">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight shrink-0">
          White Box <span className="text-zinc-400">iPhones</span>
        </Link>

        <form action="/shop" method="get" className="hidden max-w-sm flex-1 md:block">
          <input
            type="search"
            name="q"
            placeholder="Search iPhone models..."
            aria-label="Search products"
            className="w-full rounded-full border border-zinc-200 bg-transparent px-4 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:focus:border-zinc-500"
          />
        </form>

        <nav className="hidden items-center gap-6 text-sm text-zinc-500 dark:text-zinc-400 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="rounded-md border border-zinc-200 p-2 lg:hidden dark:border-zinc-700"
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
        >
          <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true">
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-zinc-200 px-6 py-4 lg:hidden dark:border-zinc-800">
          <form action="/shop" method="get" className="mb-4">
            <input
              type="search"
              name="q"
              placeholder="Search iPhone models..."
              aria-label="Search products"
              className="w-full rounded-full border border-zinc-200 bg-transparent px-4 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700"
            />
          </form>
          <nav className="flex flex-col gap-3 text-sm text-zinc-500 dark:text-zinc-400">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
