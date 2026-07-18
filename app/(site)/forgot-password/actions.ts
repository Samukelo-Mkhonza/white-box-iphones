"use server";

import { prisma } from "@/lib/prisma";
import { createPasswordResetToken } from "@/lib/password-reset";
import { sendPasswordResetEmail } from "@/lib/email";

export type ForgotPasswordFormState = {
  status: "idle" | "sent" | "error";
  message?: string;
};

export async function requestPasswordResetAction(
  _prevState: ForgotPasswordFormState,
  formData: FormData
): Promise<ForgotPasswordFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  // Same response whether or not the account exists, so this form can't be
  // used to check which emails are registered.
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const token = await createPasswordResetToken(user.id);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    await sendPasswordResetEmail(user.email, `${siteUrl}/reset-password/${token}`);
  }

  return {
    status: "sent",
    message: "If an account exists for that email, we've sent a password reset link. It expires in 1 hour.",
  };
}
