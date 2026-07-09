import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/app/(site)/account/actions";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[200px_1fr]">
        <nav className="space-y-1 text-sm">
          <p className="mb-3 px-3 text-xs font-medium uppercase tracking-wide text-zinc-400">
            Hi, {user.name.split(" ")[0]}
          </p>
          <Link
            href="/account"
            className="block rounded-md px-3 py-2 text-zinc-500 hover:bg-zinc-50 hover:text-foreground dark:text-zinc-400 dark:hover:bg-zinc-900"
          >
            Overview
          </Link>
          <Link
            href="/account/orders"
            className="block rounded-md px-3 py-2 text-zinc-500 hover:bg-zinc-50 hover:text-foreground dark:text-zinc-400 dark:hover:bg-zinc-900"
          >
            Order History
          </Link>
          <Link
            href="/account/wishlist"
            className="block rounded-md px-3 py-2 text-zinc-500 hover:bg-zinc-50 hover:text-foreground dark:text-zinc-400 dark:hover:bg-zinc-900"
          >
            Wishlist
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
        <div>{children}</div>
      </div>
    </div>
  );
}
