import { prisma } from "@/lib/prisma";

export async function getApprovedReviews(limit = 50) {
  return prisma.review.findMany({
    where: { status: "APPROVED" },
    include: { product: true, user: true },
    orderBy: { createdAt: "desc" },
    take: limit,
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
