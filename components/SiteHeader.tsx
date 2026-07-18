"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { logoutAction } from "@/app/(site)/account/actions";
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

const ICON_BUTTON_CLASS =
  "flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-foreground dark:text-zinc-400 dark:hover:bg-zinc-800";

function subscribeNoop() {
  return () => {};
}

function useIsClient() {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  );
}

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function navLinkClass(active: boolean) {
  return active
    ? "font-semibold text-foreground"
    : "text-zinc-500 transition-colors hover:text-foreground dark:text-zinc-400";
}

export function SiteHeader({
  cartCount = 0,
  userName = null,
  isAdmin = false,
}: {
  cartCount?: number;
  userName?: string | null;
  isAdmin?: boolean;
}) {
  const pathname = usePathname();

  const [moreOpen, setMoreOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const mounted = useIsClient();

  const moreContainerRef = useRef<HTMLDivElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const morePanelRef = useRef<HTMLDivElement>(null);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);
  const drawerPanelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const moreActive = MORE_LINKS.some((link) => isActivePath(pathname, link.href));

  // Close every transient bit of nav UI whenever the route changes.
  const [previousPathname, setPreviousPathname] = useState(pathname);
  if (pathname !== previousPathname) {
    setPreviousPathname(pathname);
    setMoreOpen(false);
    setMenuOpen(false);
    setMobileSearchOpen(false);
  }

  useEffect(() => {
    if (!moreOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (!moreContainerRef.current?.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [moreOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const container = drawerPanelRef.current;
      if (!container) return;
      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled])')
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    const hamburgerButton = hamburgerButtonRef.current;
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      hamburgerButton?.focus();
    };
  }, [menuOpen]);

  function handleMoreButtonKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setMoreOpen(true);
      requestAnimationFrame(() => {
        morePanelRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
      });
    } else if (event.key === "Escape" && moreOpen) {
      setMoreOpen(false);
    }
  }

  function handleMorePanelKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const items = Array.from(morePanelRef.current?.querySelectorAll<HTMLAnchorElement>("a[href]") ?? []);
    const currentIndex = items.indexOf(document.activeElement as HTMLAnchorElement);
    if (event.key === "ArrowDown") {
      event.preventDefault();
      (items[currentIndex + 1] ?? items[0])?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      (items[currentIndex - 1] ?? items[items.length - 1])?.focus();
    } else if (event.key === "Escape") {
      event.preventDefault();
      setMoreOpen(false);
      moreButtonRef.current?.focus();
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-background/95 backdrop-blur dark:border-zinc-800">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-3 px-6 py-4">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="White Box iPhones home">
          <span className="flex h-8 w-8 items-center justify-center">
            <Image
              src="/images/white-box-iphones-mark.png"
              alt=""
              width={441}
              height={353}
              priority
              className="h-full w-auto object-contain invert dark:invert-0"
            />
          </span>
          <span className="hidden text-base font-extrabold uppercase tracking-tight sm:inline">
            White Box<span aria-hidden="true">&#9642;</span>
          </span>
        </Link>

        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-7 text-sm lg:flex">
          {PRIMARY_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={navLinkClass(isActivePath(pathname, link.href))}>
              {link.label}
            </Link>
          ))}
          <div ref={moreContainerRef} className="relative">
            <button
              ref={moreButtonRef}
              type="button"
              onClick={() => setMoreOpen((open) => !open)}
              onKeyDown={handleMoreButtonKeyDown}
              aria-expanded={moreOpen}
              aria-haspopup="true"
              aria-controls="more-menu-panel"
              className={`flex items-center gap-1 transition-colors hover:text-foreground ${navLinkClass(moreActive)}`}
            >
              More
              <svg
                viewBox="0 0 20 20"
                fill="none"
                className={`h-3.5 w-3.5 transition-transform ${moreOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              >
                <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div
              id="more-menu-panel"
              ref={morePanelRef}
              role="menu"
              onKeyDown={handleMorePanelKeyDown}
              className={`absolute right-0 top-full z-20 w-[420px] max-w-[90vw] rounded-xl border border-zinc-200 bg-background p-6 shadow-xl transition-all duration-150 dark:border-zinc-800 ${
                moreOpen ? "visible translate-y-1 opacity-100" : "invisible translate-y-0 opacity-0"
              }`}
            >
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Company
                  </p>
                  <div className="flex flex-col gap-4">
                    {COMPANY_LINKS.map((link) => (
                      <Link key={link.href} href={link.href} role="menuitem" className="group/item block">
                        <span className={`block text-sm ${navLinkClass(isActivePath(pathname, link.href))}`}>
                          {link.label}
                        </span>
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
                      <Link key={link.href} href={link.href} role="menuitem" className="group/item block">
                        <span className={`block text-sm ${navLinkClass(isActivePath(pathname, link.href))}`}>
                          {link.label}
                        </span>
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
        </nav>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => setMobileSearchOpen((open) => !open)}
            aria-expanded={mobileSearchOpen}
            aria-label="Toggle search"
            className={ICON_BUTTON_CLASS}
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <Link href="/cart" className={`relative ${ICON_BUTTON_CLASS}`} aria-label="Cart">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
              <path
                d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13L5.4 5M7 13l-1.5 6h11.5M9 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-medium text-background">
                {cartCount}
              </span>
            )}
          </Link>

          <ThemeToggle />

          <span className="mx-2 hidden h-5 w-px bg-zinc-200 lg:block dark:bg-zinc-800" aria-hidden="true" />

          <div className="hidden items-center gap-5 text-sm lg:flex">
            {userName ? (
              <>
                {isAdmin && (
                  <Link href="/admin" className={navLinkClass(isActivePath(pathname, "/admin"))}>
                    Admin
                  </Link>
                )}
                <Link href="/account" className={navLinkClass(isActivePath(pathname, "/account"))}>
                  {userName.split(" ")[0]}
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="text-zinc-500 transition-colors hover:text-foreground dark:text-zinc-400"
                  >
                    Log out
                  </button>
                </form>
              </>
            ) : (
              <Link href="/login" className={navLinkClass(isActivePath(pathname, "/login"))}>
                Sign In
              </Link>
            )}
          </div>

          <Link
            href="/shop"
            className="ml-2 hidden rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80 sm:inline-block"
          >
            Shop now
          </Link>

          <button
            ref={hamburgerButtonRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="ml-1 rounded-md border border-zinc-200 p-2 lg:hidden dark:border-zinc-700"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu-drawer"
            aria-label="Toggle menu"
          >
            <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true">
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {mobileSearchOpen && (
        <form
          action="/shop"
          method="get"
          className="border-t border-zinc-200 px-6 py-3 dark:border-zinc-800"
        >
          <div className="mx-auto max-w-2xl">
            <input
              type="search"
              name="q"
              autoFocus
              placeholder="Search iPhone models..."
              aria-label="Search products"
              className="w-full rounded-full border border-zinc-200 bg-transparent px-4 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:focus:border-zinc-500"
            />
          </div>
        </form>
      )}

      {mounted &&
        createPortal(
          <div className={`fixed inset-0 z-50 lg:hidden ${menuOpen ? "" : "pointer-events-none"}`} aria-hidden={!menuOpen}>
            <div
              onClick={() => setMenuOpen(false)}
              className={`absolute inset-0 bg-zinc-950/50 transition-opacity duration-300 ${
                menuOpen ? "opacity-100" : "opacity-0"
              }`}
            />
            <div
              id="mobile-menu-drawer"
              ref={drawerPanelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              className={`absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col overflow-y-auto bg-background shadow-xl transition-transform duration-300 ease-out ${
                menuOpen ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="flex shrink-0 items-center"
                  aria-label="White Box iPhones home"
                >
                  <span className="flex h-9 w-9 items-center justify-center">
                    <Image
                      src="/images/white-box-iphones-mark.png"
                      alt="White Box iPhones"
                      width={441}
                      height={353}
                      className="h-full w-auto object-contain invert dark:invert-0"
                    />
                  </span>
                </Link>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="rounded-md p-1.5 text-zinc-500 transition-colors hover:text-foreground"
                >
                  <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true">
                    <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <form action="/shop" method="get" className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
                <input
                  type="search"
                  name="q"
                  placeholder="Search iPhone models..."
                  aria-label="Search products"
                  className="w-full rounded-full border border-zinc-200 bg-transparent px-4 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700"
                />
              </form>

              <nav className="flex flex-1 flex-col gap-6 px-6 py-6 text-sm">
                <div className="flex flex-col gap-4">
                  {PRIMARY_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={navLinkClass(isActivePath(pathname, link.href))}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Company
                  </p>
                  <div className="flex flex-col gap-4">
                    {COMPANY_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className={navLinkClass(isActivePath(pathname, link.href))}
                      >
                        {link.label}
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
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className={navLinkClass(isActivePath(pathname, link.href))}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="mt-auto flex flex-col gap-4 border-t border-zinc-200 pt-6 dark:border-zinc-800">
                  {userName ? (
                    <>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setMenuOpen(false)}
                          className={navLinkClass(isActivePath(pathname, "/admin"))}
                        >
                          Admin
                        </Link>
                      )}
                      <Link
                        href="/account"
                        onClick={() => setMenuOpen(false)}
                        className={navLinkClass(isActivePath(pathname, "/account"))}
                      >
                        My Account
                      </Link>
                      <form action={logoutAction}>
                        <button
                          type="submit"
                          className="text-zinc-500 transition-colors hover:text-foreground dark:text-zinc-400"
                        >
                          Log out
                        </button>
                      </form>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className={navLinkClass(isActivePath(pathname, "/login"))}
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </nav>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
}
