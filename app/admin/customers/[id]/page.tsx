import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCustomerForAdmin } from "@/lib/admin";
import { formatZAR } from "@/lib/format";
import { GenerateResetLinkForm } from "@/components/admin/GenerateResetLinkForm";

export const metadata: Metadata = { title: "Admin · Customer Detail" };

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await getCustomerForAdmin(id);
  if (!customer) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">{customer.name}</h1>
      <div className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        <p>{customer.email}</p>
        {customer.phone && <p>{customer.phone}</p>}
        <p>Joined {customer.createdAt.toLocaleDateString("en-ZA")}</p>
      </div>

      <div className="mt-6 max-w-xl">
        <GenerateResetLinkForm customerId={customer.id} />
      </div>

      <h2 className="mb-3 mt-8 font-semibold">Orders</h2>
      <div className="divide-y divide-zinc-200 rounded-2xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
        {customer.orders.map((order) => (
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
        {customer.orders.length === 0 && (
          <p className="p-4 text-sm text-zinc-500 dark:text-zinc-400">No orders yet.</p>
        )}
      </div>
    </div>
  );
}
