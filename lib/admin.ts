import { prisma } from "@/lib/prisma";
import type { OrderStatus, ReviewStatus } from "@prisma/client";

export async function getDashboardStats() {
  const [revenueAgg, paidOrderCount, allOrderCount, pendingReviewCount, lowStockCount, customerCount] =
    await Promise.all([
      prisma.order.aggregate({ where: { status: "PAID" }, _sum: { totalCents: true } }),
      prisma.order.count({ where: { status: "PAID" } }),
      prisma.order.count(),
      prisma.review.count({ where: { status: "PENDING" } }),
      prisma.productVariant.count({ where: { stockQty: { lt: 3 } } }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
    ]);

  const totalRevenueCents = revenueAgg._sum.totalCents ?? 0;
  const averageOrderCents = paidOrderCount > 0 ? Math.round(totalRevenueCents / paidOrderCount) : 0;

  return {
    totalRevenueCents,
    paidOrderCount,
    allOrderCount,
    averageOrderCents,
    pendingReviewCount,
    lowStockCount,
    customerCount,
  };
}

export async function getRevenueByDay(days = 7) {
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - (days - 1));

  const orders = await prisma.order.findMany({
    where: { status: "PAID", paidAt: { gte: since } },
    select: { paidAt: true, totalCents: true },
  });

  const buckets: { date: Date; label: string; totalCents: number }[] = [];
  for (let i = 0; i < days; i++) {
    const date = new Date(since);
    date.setDate(date.getDate() + i);
    buckets.push({ date, label: date.toLocaleDateString("en-ZA", { weekday: "short" }), totalCents: 0 });
  }

  for (const order of orders) {
    if (!order.paidAt) continue;
    const dayIndex = Math.floor((order.paidAt.getTime() - since.getTime()) / (1000 * 60 * 60 * 24));
    if (dayIndex >= 0 && dayIndex < days) {
      buckets[dayIndex].totalCents += order.totalCents;
    }
  }

  return buckets;
}

export async function getRecentOrders(limit = 10) {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getAllProductsForAdmin() {
  return prisma.product.findMany({
    include: {
      brand: true,
      category: true,
      colourways: { include: { variants: true } },
    },
    orderBy: [{ series: "asc" }, { name: "asc" }],
  });
}

export async function getProductForAdmin(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      colourways: {
        include: {
          images: { orderBy: { position: "asc" } },
          variants: { orderBy: [{ storageGb: "asc" }, { condition: "asc" }] },
        },
      },
    },
  });
}

export async function getAllOrdersForAdmin(status?: OrderStatus) {
  return prisma.order.findMany({
    where: status ? { status } : undefined,
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderForAdmin(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true, user: true },
  });
}

export async function getCustomersForAdmin() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: { orders: { select: { totalCents: true, status: true } } },
    orderBy: { createdAt: "desc" },
  });
  return customers.map((customer) => ({
    ...customer,
    orderCount: customer.orders.length,
    totalSpentCents: customer.orders
      .filter((o) => o.status === "PAID")
      .reduce((sum, o) => sum + o.totalCents, 0),
  }));
}

export async function getCustomerForAdmin(id: string) {
  return prisma.user.findUnique({
    where: { id, role: "CUSTOMER" },
    include: { orders: { orderBy: { createdAt: "desc" } }, addresses: true },
  });
}

export async function getReviewsForAdmin(status?: ReviewStatus) {
  return prisma.review.findMany({
    where: status ? { status } : undefined,
    include: { product: true, user: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getBrandsAndCategories() {
  const [brands, categories] = await Promise.all([
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  return { brands, categories };
}
