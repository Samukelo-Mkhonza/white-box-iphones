import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatZAR } from "@/lib/format";
import { PageHeader } from "@/components/account/PageHeader";
import { OrderStatusBadge } from "@/components/account/OrderStatusBadge";

export const metadata: Metadata = { title: "Order History" };

export default async function OrderHistoryPage() {
  const user = await getCurrentUser();
  if (!user) return null; // guarded by layout

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { items: true } } },
  });

  if (orders.length === 0) {
    return (
      <div>
        <PageHeader title="Order History" description="Every order you place will show up here." />
        <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-zinc-300 px-6 py-16 text-center dark:border-zinc-700">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-10 w-10 text-zinc-300 dark:text-zinc-600"
            aria-hidden="true"
          >
            <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" />
            <path d="M3 8l9 5 9-5" />
            <path d="M12 13v8" />
          </svg>
          <p className="mt-4 font-medium">No orders yet</p>
          <p className="mt-1 max-w-xs text-sm text-zinc-500 dark:text-zinc-400">
            When you place your first order it will appear here with its status and tracking details.
          </p>
          <Link
            href="/shop"
            className="mt-6 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-80"
          >
            Start shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Order History"
        description={`${orders.length} order${orders.length === 1 ? "" : "s"} placed on your account.`}
      />
      <div className="mt-6 divide-y divide-zinc-200 rounded-2xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/account/orders/${order.orderNumber}`}
            className="flex flex-col gap-2 p-4 transition-colors hover:bg-zinc-50 sm:flex-row sm:items-center sm:justify-between dark:hover:bg-zinc-900"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <p className="truncate font-medium">{order.orderNumber}</p>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                {order.createdAt.toLocaleDateString("en-ZA", { year: "numeric", month: "short", day: "numeric" })}{" "}
                &middot; {order._count.items} item{order._count.items === 1 ? "" : "s"}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <p className="font-semibold">{formatZAR(order.totalCents)}</p>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="hidden h-4 w-4 text-zinc-400 sm:block"
                aria-hidden="true"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
