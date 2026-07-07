"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import type { OrderStatus } from "@prisma/client";

export type FormState = {
  status: "idle" | "error";
  message?: string;
};

export async function updateOrderAction(
  orderNumber: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/login");

  const status = String(formData.get("status") ?? "") as OrderStatus;
  const trackingNumber = String(formData.get("trackingNumber") ?? "").trim();

  await prisma.order.update({
    where: { orderNumber },
    data: {
      status,
      trackingNumber: trackingNumber || null,
    },
  });

  revalidatePath(`/admin/orders/${orderNumber}`);
  revalidatePath("/admin/orders");
  return { status: "idle", message: "Order updated." };
}
