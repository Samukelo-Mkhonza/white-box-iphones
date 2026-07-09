import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Payment Cancelled" };

export default async function CheckoutCancelledPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderNumber } = await searchParams;
  const order = orderNumber ? await prisma.order.findUnique({ where: { orderNumber } }) : null;

  return (
    <div className="mx-auto max-w-lg px-6 py-20 text-center">
      <h1 className="text-2xl font-bold tracking-tight">Payment cancelled</h1>
      <p className="mt-3 text-zinc-500 dark:text-zinc-400">
        {order ? `Order ${order.orderNumber} wasn't charged.` : "Your payment wasn't charged."} You can try again
        or head back to the shop.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        {order && (
          <Link
            href={`/checkout/pay/${order.id}`}
            className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-80"
          >
            Retry Payment
          </Link>
        )}
        <Link
          href="/shop"
          className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
