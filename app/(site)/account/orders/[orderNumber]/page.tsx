import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatZAR } from "@/lib/format";
import { conditionLabel, formatStorage } from "@/lib/products";

export const metadata: Metadata = { title: "Order Details" };

export default async function AccountOrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) return null; // guarded by layout

  const { orderNumber } = await params;
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });
  if (!order || order.userId !== user.id) notFound();

  const address = JSON.parse(order.shippingAddress) as {
    nameFirst: string;
    nameLast: string;
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
        Placed {order.createdAt.toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" })}
      </p>

      <div className="mt-6 rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500 dark:text-zinc-400">Status</span>
          <span className="font-medium">{order.status}</span>
        </div>
        {order.trackingNumber && (
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Tracking number</span>
            <span className="font-medium">{order.trackingNumber}</span>
          </div>
        )}

        <div className="mt-6 space-y-2 border-t border-zinc-200 pt-4 text-sm dark:border-zinc-800">
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
          <p className="font-medium text-foreground">Shipped to</p>
          <p>
            {address.nameFirst} {address.nameLast}
          </p>
          <p>{address.line1}</p>
          {address.line2 && <p>{address.line2}</p>}
          <p>
            {address.city}, {address.province} {address.postalCode}
          </p>
        </div>
      </div>
    </div>
  );
}
