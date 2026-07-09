import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { OrderStatus } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatZAR } from "@/lib/format";
import { conditionLabel, formatStorage } from "@/lib/products";
import { OrderStatusBadge } from "@/components/account/OrderStatusBadge";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = { title: "Order Details" };

const TIMELINE: { status: OrderStatus; label: string }[] = [
  { status: "PENDING", label: "Placed" },
  { status: "PAID", label: "Paid" },
  { status: "PROCESSING", label: "Processing" },
  { status: "SHIPPED", label: "Shipped" },
  { status: "DELIVERED", label: "Delivered" },
];

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
    include: {
      items: {
        include: {
          variant: {
            include: {
              colourway: { include: { images: { orderBy: { position: "asc" }, take: 1 } } },
              product: { select: { slug: true } },
            },
          },
        },
      },
    },
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

  const timelineIndex = TIMELINE.findIndex((step) => step.status === order.status);
  const isClosed = order.status === "CANCELLED" || order.status === "REFUNDED";

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Account", href: "/account" },
          { label: "Order History", href: "/account/orders" },
          { label: order.orderNumber },
        ]}
      />
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Order {order.orderNumber}</h1>
        <OrderStatusBadge status={order.status} />
      </div>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Placed {order.createdAt.toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" })}
      </p>

      <div className="mt-6 rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
        {isClosed ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            This order was {order.status === "CANCELLED" ? "cancelled" : "refunded"}
            {order.updatedAt &&
              ` on ${order.updatedAt.toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" })}`}
            . If you have any questions,{" "}
            <Link href="/contact" className="underline hover:text-foreground">
              contact us
            </Link>
            .
          </p>
        ) : (
          <ol className="flex items-start">
            {TIMELINE.map((step, i) => {
              const reached = i <= timelineIndex;
              const isLast = i === TIMELINE.length - 1;
              return (
                <li key={step.status} className={`flex flex-col items-center ${isLast ? "" : "flex-1"}`}>
                  <div className="flex w-full items-center">
                    <div
                      className={`mx-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                        reached
                          ? "border-foreground bg-foreground text-background"
                          : "border-zinc-300 text-transparent dark:border-zinc-700"
                      }`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3 w-3"
                        aria-hidden="true"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {!isLast && (
                      <div
                        className={`h-0.5 flex-1 ${
                          i < timelineIndex ? "bg-foreground" : "bg-zinc-200 dark:bg-zinc-800"
                        }`}
                      />
                    )}
                  </div>
                  <span
                    className={`mt-2 w-full pr-2 text-center text-[11px] sm:text-xs ${
                      reached ? "font-medium" : "text-zinc-400 dark:text-zinc-500"
                    }`}
                  >
                    {step.label}
                  </span>
                </li>
              );
            })}
          </ol>
        )}

        {order.trackingNumber && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-zinc-50 px-4 py-3 text-sm dark:bg-zinc-900">
            <span className="text-zinc-500 dark:text-zinc-400">Tracking number</span>
            <span className="font-mono font-medium">{order.trackingNumber}</span>
          </div>
        )}
      </div>

      <div className="mt-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {order.items.map((item) => {
            const image = item.variant.colourway.images[0];
            return (
              <div key={item.id} className="flex items-center gap-4 p-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-50 dark:bg-zinc-900">
                  {image && (
                    <Image src={image.url} alt={image.altText} fill unoptimized className="object-contain p-2" />
                  )}
                </div>
                <div className="min-w-0 flex-1 text-sm">
                  <Link
                    href={`/product/${item.variant.product.slug}`}
                    className="font-medium hover:underline"
                  >
                    {item.productName}
                  </Link>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {item.colourName} &middot; {formatStorage(item.storageGb)} &middot;{" "}
                    {conditionLabel(item.condition)}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                    Qty {item.quantity} &times; {formatZAR(item.priceCentsAtOrder)}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold">
                  {formatZAR(item.priceCentsAtOrder * item.quantity)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="space-y-1 border-t border-zinc-200 p-4 text-sm dark:border-zinc-800">
          <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
            <span>Subtotal</span>
            <span>{formatZAR(order.subtotalCents)}</span>
          </div>
          {order.discountCents > 0 && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
              <span>Discount</span>
              <span>&minus;{formatZAR(order.discountCents)}</span>
            </div>
          )}
          <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
            <span>Shipping</span>
            <span>{order.shippingFeeCents === 0 ? "Free" : formatZAR(order.shippingFeeCents)}</span>
          </div>
          <div className="flex justify-between pt-1 text-lg font-bold">
            <span>Total</span>
            <span>{formatZAR(order.totalCents)}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 p-5 text-sm dark:border-zinc-800">
          <p className="font-semibold">Shipped to</p>
          <div className="mt-2 space-y-0.5 text-zinc-500 dark:text-zinc-400">
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
        <div className="rounded-2xl border border-zinc-200 p-5 text-sm dark:border-zinc-800">
          <p className="font-semibold">Need help?</p>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Questions about this order? Our team is happy to help with returns, warranty claims or delivery
            updates.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-block rounded-full border border-zinc-300 px-5 py-2 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Contact support
          </Link>
        </div>
      </div>
    </div>
  );
}
