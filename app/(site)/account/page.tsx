import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Your Account" };

export default async function AccountOverviewPage() {
  const user = await getCurrentUser();
  if (!user) return null; // guarded by layout

  const [orderCount, wishlistCount] = await Promise.all([
    prisma.order.count({ where: { userId: user.id } }),
    prisma.wishlistItem.count({ where: { userId: user.id } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Account Overview</h1>
      <div className="mt-6 space-y-1 text-sm text-zinc-500 dark:text-zinc-400">
        <p>
          <span className="font-medium text-foreground">Name:</span> {user.name}
        </p>
        <p>
          <span className="font-medium text-foreground">Email:</span> {user.email}
        </p>
        {user.phone && (
          <p>
            <span className="font-medium text-foreground">Phone:</span> {user.phone}
          </p>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/account/orders"
          className="rounded-2xl border border-zinc-200 p-5 hover:shadow-lg dark:border-zinc-800"
        >
          <p className="text-2xl font-bold">{orderCount}</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Order{orderCount === 1 ? "" : "s"} placed</p>
        </Link>
        <Link
          href="/account/wishlist"
          className="rounded-2xl border border-zinc-200 p-5 hover:shadow-lg dark:border-zinc-800"
        >
          <p className="text-2xl font-bold">{wishlistCount}</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Item{wishlistCount === 1 ? "" : "s"} on your wishlist
          </p>
        </Link>
      </div>
    </div>
  );
}
