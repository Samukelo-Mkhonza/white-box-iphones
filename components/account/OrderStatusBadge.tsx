import type { OrderStatus } from "@prisma/client";

const STATUS_STYLES: Record<OrderStatus, { label: string; className: string }> = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  },
  PAID: {
    label: "Paid",
    className: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-400",
  },
  PROCESSING: {
    label: "Processing",
    className: "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-400",
  },
  SHIPPED: {
    label: "Shipped",
    className: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  },
  DELIVERED: {
    label: "Delivered",
    className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
  },
  REFUNDED: {
    label: "Refunded",
    className: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, className } = STATUS_STYLES[status];
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
