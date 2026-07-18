import Image from "next/image";
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
    <footer className="section-dark">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-16 text-sm sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <span className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center">
              <Image
                src="/images/white-box-iphones-mark.png"
                alt=""
                width={441}
                height={353}
                className="h-full w-auto object-contain"
              />
            </span>
            <span className="text-base font-extrabold uppercase tracking-tight text-white">
              White Box<span aria-hidden="true">&#9642;</span>
            </span>
          </span>
          <p className="mt-4 leading-relaxed text-zinc-400">
            Certified, warrantied white-box iPhones delivered across South Africa.
          </p>
        </div>

        <div>
          <p className="eyebrow text-zinc-500">Company</p>
          <ul className="mt-4 space-y-2.5 text-zinc-400">
            {COMPANY_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-zinc-500">Policies</p>
          <ul className="mt-4 space-y-2.5 text-zinc-400">
            {POLICY_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-zinc-500">Get in touch</p>
          <ul className="mt-4 space-y-2.5 text-zinc-400">
            <li>hello@whiteboxiphones.example</li>
            <li>Mon&ndash;Fri, 9am&ndash;5pm SAST</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-zinc-800 px-6 py-6 text-center text-xs text-zinc-500">
        &copy; {new Date().getFullYear()} White Box iPhones. All prices in ZAR.
      </div>
    </footer>
  );
}
