import { prisma } from "@/lib/prisma";

export async function getStoreSettings() {
  const settings = await prisma.storeSetting.findUnique({ where: { id: "1" } });
  return (
    settings ?? {
      id: "1",
      flatShippingFeeCents: 15000,
      minDeliveryDays: 2,
      maxDeliveryDays: 5,
    }
  );
}
