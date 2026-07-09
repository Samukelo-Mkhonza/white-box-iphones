import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatZAR } from "@/lib/format";
import { conditionLabel, formatStorage } from "@/lib/products";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = { title: "Track Order" };

export default async function TrackOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ orderNumber?: string; email?: string }>;
}) {
  const { orderNumber, email } = await searchParams;
  const hasQuery = !!orderNumber && !!email;

  const order = hasQuery
    ? await prisma.order.findFirst({
        where: {
          orderNumber: orderNumber!.trim(),
          OR: [{ guestEmail: email!.trim().toLowerCase() }, { user: { email: email!.trim().toLowerCase() } }],
        },
        include: { items: true },
      })
    : null;

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Track Order" }]} />
      <h1 className="text-2xl font-bold tracking-tight">Track Your Order</h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        Enter your order number and the email address used at checkout.
      </p>

      <form action="/track-order" method="get" className="mt-6 space-y-4">
        <div>
          <label htmlFor="orderNumber" className="mb-1 block text-sm font-medium">
            Order number
          </label>
          <input
            id="orderNumber"
            name="orderNumber"
            type="text"
            defaultValue={orderNumber ?? ""}
            placeholder="WB-XXXXX-XXXX"
            required
            className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={email ?? ""}
            required
            className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-foreground py-3 text-sm font-medium text-background hover:opacity-80"
        >
          Track Order
        </button>
      </form>

      {hasQuery && !order && (
        <p className="mt-6 text-sm text-red-600 dark:text-red-400">
          We couldn&apos;t find an order matching those details. Double-check your order number and email.
        </p>
      )}

      {order && (
        <div className="mt-8 rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Order</span>
            <span className="font-medium">{order.orderNumber}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Status</span>
            <span className="font-medium">{order.status}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Tracking number</span>
            <span className="font-medium">{order.trackingNumber ?? "Not yet shipped"}</span>
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

          <div className="mt-4 flex justify-between border-t border-zinc-200 pt-4 text-lg font-bold dark:border-zinc-800">
            <span>Total</span>
            <span>{formatZAR(order.totalCents)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
