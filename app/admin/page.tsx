import type { Metadata } from "next";
import Link from "next/link";
import { getDashboardStats, getRevenueByDay, getRecentOrders } from "@/lib/admin";
import { formatZAR } from "@/lib/format";
import { RevenueBarChart } from "@/components/RevenueBarChart";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const [stats, revenueByDay, recentOrders] = await Promise.all([
    getDashboardStats(),
    getRevenueByDay(7),
    getRecentOrders(8),
  ]);

  const statTiles = [
    { label: "Total revenue (paid)", value: formatZAR(stats.totalRevenueCents) },
    { label: "Paid orders", value: String(stats.paidOrderCount) },
    { label: "Average order value", value: formatZAR(stats.averageOrderCents) },
    { label: "Total orders (all statuses)", value: String(stats.allOrderCount) },
    { label: "Customers", value: String(stats.customerCount) },
    { label: "Reviews awaiting approval", value: String(stats.pendingReviewCount) },
    { label: "Variants low on stock (<3)", value: String(stats.lowStockCount) },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {statTiles.map((tile) => (
          <div key={tile.label} className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
            <p className="text-xl font-bold">{tile.value}</p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{tile.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
        <h2 className="mb-4 font-semibold">Revenue, last 7 days (paid orders)</h2>
        <RevenueBarChart data={revenueByDay} />
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-zinc-500 hover:text-foreground dark:text-zinc-400">
            View all &rarr;
          </Link>
        </div>
        <div className="divide-y divide-zinc-200 rounded-2xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
          {recentOrders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.orderNumber}`}
              className="flex items-center justify-between gap-4 p-4 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              <div>
                <p className="font-medium">{order.orderNumber}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {order.createdAt.toLocaleDateString("en-ZA")} &middot; {order.status}
                </p>
              </div>
              <p className="font-semibold">{formatZAR(order.totalCents)}</p>
            </Link>
          ))}
          {recentOrders.length === 0 && (
            <p className="p-4 text-sm text-zinc-500 dark:text-zinc-400">No orders yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
