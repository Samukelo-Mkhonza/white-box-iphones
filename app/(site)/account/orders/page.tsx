import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatZAR } from "@/lib/format";

export const metadata: Metadata = { title: "Order History" };

export default async function OrderHistoryPage() {
  const user = await getCurrentUser();
  if (!user) return null; // guarded by layout

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  if (orders.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Order History</h1>
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
          You haven&apos;t placed any orders yet.{" "}
          <Link href="/shop" className="underline">
            Start shopping
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Order History</h1>
      <div className="mt-6 divide-y divide-zinc-200 rounded-2xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/account/orders/${order.orderNumber}`}
            className="flex flex-col gap-1 p-4 hover:bg-zinc-50 sm:flex-row sm:items-center sm:justify-between dark:hover:bg-zinc-900"
          >
            <div>
              <p className="font-medium">{order.orderNumber}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {order.createdAt.toLocaleDateString("en-ZA", { year: "numeric", month: "short", day: "numeric" })}{" "}
                &middot; {order.status}
              </p>
            </div>
            <p className="font-semibold">{formatZAR(order.totalCents)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
