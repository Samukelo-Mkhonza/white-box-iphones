"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { logoutAction } from "@/app/account/actions";
import { ThemeToggle } from "@/components/ThemeToggle";

const PRIMARY_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/catalogue", label: "Catalogue" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About", description: "Our story and mission" },
  { href: "/reviews", label: "Reviews", description: "What our customers are saying" },
];

const SUPPORT_LINKS = [
  { href: "/faq", label: "FAQ", description: "Answers to common questions" },
  { href: "/contact", label: "Contact", description: "Get in touch with our team" },
  { href: "/track-order", label: "Track Order", description: "Check the status of your order" },
];

const MORE_LINKS = [...COMPANY_LINKS, ...SUPPORT_LINKS];

const NAV_LINKS = [...PRIMARY_LINKS, ...MORE_LINKS];

export function SiteHeader({
  cartCount = 0,
  userName = null,
  isAdmin = false,
}: {
  cartCount?: number;
  userName?: string | null;
  isAdmin?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-background/95 backdrop-blur dark:border-zinc-800">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex shrink-0 items-center" aria-label="White Box iPhones home">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-zinc-900 p-1.5 dark:bg-transparent dark:p-0">
            <Image
              src="/images/white-box-iphones-mark.png"
              alt="White Box iPhones"
              width={441}
              height={353}
              priority
              className="h-full w-auto object-contain"
            />
          </span>
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
          {PRIMARY_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
          <div className="group relative">
            <button
              type="button"
              className="flex items-center gap-1 transition-colors hover:text-foreground"
            >
              More
              <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="invisible absolute right-0 top-full z-20 w-[420px] max-w-[90vw] translate-y-1 rounded-xl border border-zinc-200 bg-background p-6 opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 dark:border-zinc-800">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Company
                  </p>
                  <div className="flex flex-col gap-4">
                    {COMPANY_LINKS.map((link) => (
                      <Link key={link.href} href={link.href} className="group/item block">
                        <span className="block text-sm font-semibold text-foreground">{link.label}</span>
                        <span className="mt-0.5 block text-xs text-zinc-500 transition-colors group-hover/item:text-foreground dark:text-zinc-400">
                          {link.description}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Support
                  </p>
                  <div className="flex flex-col gap-4">
                    {SUPPORT_LINKS.map((link) => (
                      <Link key={link.href} href={link.href} className="group/item block">
                        <span className="block text-sm font-semibold text-foreground">{link.label}</span>
                        <span className="mt-0.5 block text-xs text-zinc-500 transition-colors group-hover/item:text-foreground dark:text-zinc-400">
                          {link.description}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {userName ? (
            <>
              {isAdmin && (
                <Link href="/admin" className="hover:text-foreground">
                  Admin
                </Link>
              )}
              <Link href="/account" className="hover:text-foreground">
                {userName.split(" ")[0]}
              </Link>
              <form action={logoutAction}>
                <button type="submit" className="hover:text-foreground">
                  Log out
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" className="hover:text-foreground">
              Sign In
            </Link>
          )}
        </nav>

        <Link href="/cart" className="relative hidden shrink-0 lg:block" aria-label="Cart">
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
            <path
              d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13L5.4 5M7 13l-1.5 6h11.5M9 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-medium text-background">
              {cartCount}
            </span>
          )}
        </Link>

        <ThemeToggle />

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
            <Link href="/cart" onClick={() => setMenuOpen(false)} className="hover:text-foreground">
              Cart{cartCount > 0 ? ` (${cartCount})` : ""}
            </Link>
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
            {userName ? (
              <>
                {isAdmin && (
                  <Link href="/admin" onClick={() => setMenuOpen(false)} className="hover:text-foreground">
                    Admin
                  </Link>
                )}
                <Link href="/account" onClick={() => setMenuOpen(false)} className="hover:text-foreground">
                  My Account
                </Link>
                <form action={logoutAction}>
                  <button type="submit" className="hover:text-foreground">
                    Log out
                  </button>
                </form>
              </>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)} className="hover:text-foreground">
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
