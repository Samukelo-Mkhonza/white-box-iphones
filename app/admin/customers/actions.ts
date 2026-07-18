"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { createPasswordResetToken } from "@/lib/password-reset";
import { sendPasswordResetEmail } from "@/lib/email";

export type ResetLinkFormState = {
  status: "idle" | "generated" | "error";
  message?: string;
  resetUrl?: string;
};

export async function generateResetLinkAction(
  customerId: string
): Promise<ResetLinkFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { status: "error", message: "You must be signed in as an admin." };
  }

  const customer = await prisma.user.findUnique({
    where: { id: customerId, role: "CUSTOMER" },
  });
  if (!customer) {
    return { status: "error", message: "Customer not found." };
  }

  const token = await createPasswordResetToken(customer.id);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const resetUrl = `${siteUrl}/reset-password/${token}`;
  await sendPasswordResetEmail(customer.email, resetUrl);

  return {
    status: "generated",
    message: `Reset link created for ${customer.email}. It expires in 1 hour and can only be used once.`,
    resetUrl,
  };
}
