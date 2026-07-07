import type { Metadata } from "next";
import Link from "next/link";
import { getAllOrdersForAdmin } from "@/lib/admin";
import { formatZAR } from "@/lib/format";
import type { OrderStatus } from "@prisma/client";

export const metadata: Metadata = { title: "Admin · Orders" };

const STATUSES: OrderStatus[] = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const validStatus = STATUSES.includes(status as OrderStatus) ? (status as OrderStatus) : undefined;
  const orders = await getAllOrdersForAdmin(validStatus);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Orders</h1>

      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <Link
          href="/admin/orders"
          className={`rounded-full px-3 py-1 ${!validStatus ? "bg-foreground text-background" : "border border-zinc-200 dark:border-zinc-700"}`}
        >
          All
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`rounded-full px-3 py-1 ${validStatus === s ? "bg-foreground text-background" : "border border-zinc-200 dark:border-zinc-700"}`}
          >
            {s}
          </Link>
        ))}
      </div>

      <div className="mt-6 divide-y divide-zinc-200 rounded-2xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/admin/orders/${order.orderNumber}`}
            className="flex flex-col gap-1 p-4 text-sm hover:bg-zinc-50 sm:flex-row sm:items-center sm:justify-between dark:hover:bg-zinc-900"
          >
            <div>
              <p className="font-medium">{order.orderNumber}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {order.user?.name ?? order.guestEmail} &middot;{" "}
                {order.createdAt.toLocaleDateString("en-ZA", { year: "numeric", month: "short", day: "numeric" })}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium dark:bg-zinc-800">
                {order.status}
              </span>
              <p className="font-semibold">{formatZAR(order.totalCents)}</p>
            </div>
          </Link>
        ))}
        {orders.length === 0 && <p className="p-4 text-sm text-zinc-500 dark:text-zinc-400">No orders found.</p>}
      </div>
    </div>
  );
}
