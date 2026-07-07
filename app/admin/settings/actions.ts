"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export type FormState = {
  status: "idle" | "error";
  message?: string;
};

export async function updateStoreSettingsAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/login");

  const flatShippingFeeRand = Number(formData.get("flatShippingFeeRand"));
  const minDeliveryDays = Number(formData.get("minDeliveryDays"));
  const maxDeliveryDays = Number(formData.get("maxDeliveryDays"));

  if (
    Number.isNaN(flatShippingFeeRand) ||
    flatShippingFeeRand < 0 ||
    !Number.isInteger(minDeliveryDays) ||
    !Number.isInteger(maxDeliveryDays) ||
    minDeliveryDays < 1 ||
    maxDeliveryDays < minDeliveryDays
  ) {
    return { status: "error", message: "Please check the shipping fee and delivery day values." };
  }

  await prisma.storeSetting.upsert({
    where: { id: "1" },
    update: {
      flatShippingFeeCents: Math.round(flatShippingFeeRand * 100),
      minDeliveryDays,
      maxDeliveryDays,
    },
    create: {
      id: "1",
      flatShippingFeeCents: Math.round(flatShippingFeeRand * 100),
      minDeliveryDays,
      maxDeliveryDays,
    },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  return { status: "idle", message: "Settings saved." };
}
