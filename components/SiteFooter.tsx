import Link from "next/link";

const POLICY_LINKS = [
  { href: "/policies/privacy", label: "Privacy Policy" },
  { href: "/policies/returns", label: "Returns Policy" },
  { href: "/policies/warranty", label: "Warranty" },
  { href: "/policies/shipping", label: "Shipping Policy" },
  { href: "/policies/terms", label: "Terms of Service" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/faq", label: "FAQ" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-12 text-sm sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <p className="font-semibold text-foreground">White Box iPhones</p>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Certified, warrantied white-box iPhones delivered across South Africa.
          </p>
        </div>

        <div>
          <p className="font-medium text-foreground">Company</p>
          <ul className="mt-3 space-y-2 text-zinc-500 dark:text-zinc-400">
            {COMPANY_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-medium text-foreground">Policies</p>
          <ul className="mt-3 space-y-2 text-zinc-500 dark:text-zinc-400">
            {POLICY_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-medium text-foreground">Get in touch</p>
          <ul className="mt-3 space-y-2 text-zinc-500 dark:text-zinc-400">
            <li>hello@whiteboxiphones.example</li>
            <li>Mon&ndash;Fri, 9am&ndash;5pm SAST</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-zinc-200 px-6 py-6 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        &copy; {new Date().getFullYear()} White Box iPhones. All prices in ZAR.
      </div>
    </footer>
  );
}
