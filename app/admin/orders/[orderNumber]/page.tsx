import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrderForAdmin } from "@/lib/admin";
import { formatZAR } from "@/lib/format";
import { conditionLabel, formatStorage } from "@/lib/products";
import { OrderStatusForm } from "@/components/admin/OrderStatusForm";

export const metadata: Metadata = { title: "Admin · Order Detail" };

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await getOrderForAdmin(orderNumber);
  if (!order) notFound();

  const address = JSON.parse(order.shippingAddress) as {
    nameFirst: string;
    nameLast: string;
    email: string;
    phone?: string;
    line1: string;
    line2?: string;
    city: string;
    province: string;
    postalCode: string;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Order {order.orderNumber}</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Placed {order.createdAt.toLocaleString("en-ZA")}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="mb-4 font-semibold">Items</h2>
          <div className="space-y-2 text-sm">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between gap-4">
                <span className="text-zinc-500 dark:text-zinc-400">
                  {item.quantity} &times; {item.productName} ({item.colourName}, {formatStorage(item.storageGb)},{" "}
                  {conditionLabel(item.condition)})
                </span>
                <span className="font-medium">{formatZAR(item.priceCentsAtOrder * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-1 border-t border-zinc-200 pt-4 text-sm dark:border-zinc-800">
            <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
              <span>Subtotal</span>
              <span>{formatZAR(order.subtotalCents)}</span>
            </div>
            <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
              <span>Shipping</span>
              <span>{formatZAR(order.shippingFeeCents)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatZAR(order.totalCents)}</span>
            </div>
          </div>

          <div className="mt-6 border-t border-zinc-200 pt-4 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            <p className="font-medium text-foreground">Customer</p>
            <p>
              {address.nameFirst} {address.nameLast} &middot; {address.email}
            </p>
            {address.phone && <p>{address.phone}</p>}
            {order.user && <p>Account: {order.user.email}</p>}
            <p className="mt-2 font-medium text-foreground">Shipping to</p>
            <p>{address.line1}</p>
            {address.line2 && <p>{address.line2}</p>}
            <p>
              {address.city}, {address.province} {address.postalCode}
            </p>
          </div>
        </div>

        <div className="h-fit rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="mb-4 font-semibold">Manage Order</h2>
          <OrderStatusForm
            orderNumber={order.orderNumber}
            currentStatus={order.status}
            currentTrackingNumber={order.trackingNumber}
          />
        </div>
      </div>
    </div>
  );
}
