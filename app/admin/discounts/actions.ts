"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export type FormState = {
  status: "idle" | "error";
  message?: string;
};

export async function createDiscountCodeAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/login");

  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const type = String(formData.get("type") ?? "PERCENTAGE") as "PERCENTAGE" | "FIXED";
  const value = Number(formData.get("value"));
  const usageLimit = formData.get("usageLimit") ? Number(formData.get("usageLimit")) : null;
  const expiresAtRaw = String(formData.get("expiresAt") ?? "");

  if (!code || !value || value <= 0) {
    return { status: "error", message: "Please provide a code and a positive value." };
  }
  if (type === "PERCENTAGE" && value > 100) {
    return { status: "error", message: "Percentage discounts can't exceed 100." };
  }

  const existing = await prisma.discountCode.findUnique({ where: { code } });
  if (existing) {
    return { status: "error", message: "A discount code with that name already exists." };
  }

  await prisma.discountCode.create({
    data: {
      code,
      type,
      value: type === "FIXED" ? Math.round(value * 100) : Math.round(value),
      usageLimit,
      expiresAt: expiresAtRaw ? new Date(expiresAtRaw) : null,
    },
  });

  revalidatePath("/admin/discounts");
  return { status: "idle", message: "Discount code created." };
}

export async function toggleDiscountCodeAction(id: string) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/login");

  const code = await prisma.discountCode.findUnique({ where: { id } });
  if (!code) return;

  await prisma.discountCode.update({ where: { id }, data: { active: !code.active } });
  revalidatePath("/admin/discounts");
}

export async function deleteDiscountCodeAction(id: string) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/login");

  await prisma.discountCode.delete({ where: { id } });
  revalidatePath("/admin/discounts");
}
