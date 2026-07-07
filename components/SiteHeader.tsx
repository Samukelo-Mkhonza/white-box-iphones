"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { logoutAction } from "@/app/account/actions";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/reviews", label: "Reviews" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/track-order", label: "Track Order" },
];

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
        <Link href="/" className="flex shrink-0 items-center gap-2 text-lg font-semibold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-zinc-900 p-1.5 dark:bg-transparent dark:p-0">
            <Image
              src="/images/white-box-iphones-mark.png"
              alt=""
              width={441}
              height={353}
              priority
              className="h-full w-auto object-contain"
            />
          </span>
          <span>
            White Box <span className="text-zinc-400">iPhones</span>
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
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          ))}
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
