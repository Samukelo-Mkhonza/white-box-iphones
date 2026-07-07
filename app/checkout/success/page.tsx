import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatZAR } from "@/lib/format";
import { conditionLabel, formatStorage } from "@/lib/products";

export const metadata: Metadata = { title: "Order Confirmed" };

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderNumber } = await searchParams;
  if (!orderNumber) notFound();

  const order = await prisma.order.findUnique({ where: { orderNumber }, include: { items: true } });
  if (!order) notFound();

  const address = JSON.parse(order.shippingAddress) as {
    nameFirst: string;
    nameLast: string;
    line1: string;
    city: string;
    province: string;
    postalCode: string;
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {order.status === "PAID" ? "Payment received!" : "Order placed"}
        </h1>
        <p className="mt-3 text-zinc-500 dark:text-zinc-400">
          {order.status === "PAID"
            ? `We've emailed a confirmation to ${order.guestEmail}.`
            : "We're still confirming your payment with PayFast — this can take a few seconds."}
        </p>
      </div>

      <div className="mt-10 rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500 dark:text-zinc-400">Order number</span>
          <span className="font-medium">{order.orderNumber}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-zinc-500 dark:text-zinc-400">Status</span>
          <span className="font-medium">{order.status}</span>
        </div>

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
          <p className="font-medium text-foreground">Shipping to</p>
          <p>
            {address.nameFirst} {address.nameLast}
          </p>
          <p>{address.line1}</p>
          <p>
            {address.city}, {address.province} {address.postalCode}
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/shop"
          className="rounded-full bg-foreground px-8 py-3 text-sm font-medium text-background hover:opacity-80"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
