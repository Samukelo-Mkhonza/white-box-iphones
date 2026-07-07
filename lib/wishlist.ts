import { prisma } from "@/lib/prisma";

export async function getWishlist(userId: string) {
  return prisma.wishlistItem.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          colourways: { include: { images: { orderBy: { position: "asc" as const } } }, take: 1 },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function isInWishlist(userId: string, productId: string): Promise<boolean> {
  const item = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId, productId } },
  });
  return !!item;
}

export async function toggleWishlist(userId: string, productId: string): Promise<boolean> {
  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId, productId } },
  });
  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
    return false;
  }
  await prisma.wishlistItem.create({ data: { userId, productId } });
  return true;
}
