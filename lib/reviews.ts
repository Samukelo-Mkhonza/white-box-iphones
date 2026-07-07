import { prisma } from "@/lib/prisma";

export async function getApprovedReviews(limit = 50) {
  return prisma.review.findMany({
    where: { status: "APPROVED" },
    include: { product: true, user: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getApprovedReviewsForProduct(productId: string) {
  return prisma.review.findMany({
    where: { productId, status: "APPROVED" },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getUserReviewForProduct(userId: string, productId: string) {
  return prisma.review.findFirst({ where: { userId, productId } });
}

async function hasPurchased(userId: string, productId: string): Promise<boolean> {
  const paidOrderItem = await prisma.orderItem.findFirst({
    where: {
      order: { userId, status: "PAID" },
      variant: { productId },
    },
  });
  return !!paidOrderItem;
}

export async function createReview(
  userId: string,
  productId: string,
  rating: number,
  title: string,
  body: string
) {
  const verifiedPurchase = await hasPurchased(userId, productId);
  return prisma.review.create({
    data: { userId, productId, rating, title, body, verifiedPurchase, status: "PENDING" },
  });
}

export async function getReviewStats() {
  const reviews = await prisma.review.findMany({
    where: { status: "APPROVED" },
    select: { rating: true },
  });
  const count = reviews.length;
  const average = count ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;
  return { count, average };
}
