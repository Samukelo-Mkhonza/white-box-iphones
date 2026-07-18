"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { findValidPasswordResetToken } from "@/lib/password-reset";

export type ResetPasswordFormState = {
  status: "idle" | "error";
  message?: string;
};

export async function resetPasswordAction(
  _prevState: ResetPasswordFormState,
  formData: FormData
): Promise<ResetPasswordFormState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password.length < 8) {
    return { status: "error", message: "Password must be at least 8 characters." };
  }
  if (password !== confirmPassword) {
    return { status: "error", message: "Passwords do not match." };
  }

  const resetToken = await findValidPasswordResetToken(token);
  if (!resetToken) {
    return {
      status: "error",
      message: "This reset link is invalid or has expired. Please request a new one.",
    };
  }

  const passwordHash = await hashPassword(password);
  await prisma.$transaction([
    prisma.user.update({ where: { id: resetToken.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    }),
    // Sign out every existing session so anyone holding the old password
    // (or a stolen session) is logged out.
    prisma.session.deleteMany({ where: { userId: resetToken.userId } }),
  ]);

  redirect("/login?reset=1");
}
