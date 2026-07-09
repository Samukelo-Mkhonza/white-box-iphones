import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatZAR } from "@/lib/format";
import { PageHeader } from "@/components/account/PageHeader";
import { OrderStatusBadge } from "@/components/account/OrderStatusBadge";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = { title: "Your Account" };

export default async function AccountOverviewPage() {
  const user = await getCurrentUser();
  if (!user) return null; // guarded by layout

  const [orderCount, wishlistCount, recentOrders] = await Promise.all([
    prisma.order.count({ where: { userId: user.id } }),
    prisma.wishlistItem.count({ where: { userId: user.id } }),
    prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Account" }]} />
      <PageHeader
        title="Account Overview"
        description="Your profile, orders and saved items at a glance."
      />

      <div className="mt-6 flex items-center gap-4 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-lg font-semibold dark:bg-zinc-900">
          {initials}
        </div>
        <div className="min-w-0 text-sm">
          <p className="truncate text-base font-semibold">{user.name}</p>
          <p className="truncate text-zinc-500 dark:text-zinc-400">
            {user.email}
            {user.phone && <> &middot; {user.phone}</>}
          </p>
          <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
            Member since{" "}
            {user.createdAt.toLocaleDateString("en-ZA", { year: "numeric", month: "long" })}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/account/orders"
          className="group rounded-2xl border border-zinc-200 p-5 transition-shadow hover:shadow-lg dark:border-zinc-800"
        >
          <p className="text-2xl font-bold">{orderCount}</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Order{orderCount === 1 ? "" : "s"} placed
          </p>
          <p className="mt-3 text-xs font-medium text-zinc-400 transition-colors group-hover:text-foreground dark:text-zinc-500">
            View all &rarr;
          </p>
        </Link>
        <Link
          href="/account/wishlist"
          className="group rounded-2xl border border-zinc-200 p-5 transition-shadow hover:shadow-lg dark:border-zinc-800"
        >
          <p className="text-2xl font-bold">{wishlistCount}</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Item{wishlistCount === 1 ? "" : "s"} on your wishlist
          </p>
          <p className="mt-3 text-xs font-medium text-zinc-400 transition-colors group-hover:text-foreground dark:text-zinc-500">
            View all &rarr;
          </p>
        </Link>
      </div>

      {recentOrders.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Recent orders</h2>
            <Link
              href="/account/orders"
              className="text-xs font-medium text-zinc-500 hover:text-foreground dark:text-zinc-400"
            >
              View all &rarr;
            </Link>
          </div>
          <div className="mt-3 divide-y divide-zinc-200 rounded-2xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.orderNumber}`}
                className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{order.orderNumber}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {order.createdAt.toLocaleDateString("en-ZA", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <OrderStatusBadge status={order.status} />
                  <p className="text-sm font-semibold">{formatZAR(order.totalCents)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
