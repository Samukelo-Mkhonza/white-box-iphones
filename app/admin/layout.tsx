import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { logoutAction } from "@/app/account/actions";

const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/discounts", label: "Discount Codes" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/login");

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        <nav className="space-y-1 text-sm">
          <Link href="/" className="mb-3 flex items-center gap-2 px-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-900 p-1.5 dark:bg-transparent dark:p-0">
              <Image
                src="/images/white-box-iphones-mark.png"
                alt="White Box iPhones"
                width={441}
                height={353}
                className="h-full w-auto object-contain"
              />
            </span>
          </Link>
          <p className="mb-3 px-3 text-xs font-medium uppercase tracking-wide text-zinc-400">
            Admin &middot; {admin.name.split(" ")[0]}
          </p>
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-3 py-2 text-zinc-500 hover:bg-zinc-50 hover:text-foreground dark:text-zinc-400 dark:hover:bg-zinc-900"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/"
            className="block rounded-md px-3 py-2 text-zinc-500 hover:bg-zinc-50 hover:text-foreground dark:text-zinc-400 dark:hover:bg-zinc-900"
          >
            &larr; Back to site
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full rounded-md px-3 py-2 text-left text-red-600 hover:bg-zinc-50 dark:text-red-400 dark:hover:bg-zinc-900"
            >
              Log out
            </button>
          </form>
        </nav>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
