"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";
import { mergeGuestCartIntoUser } from "@/lib/cart";

export type AuthFormState = {
  status: "idle" | "error";
  message?: string;
};

export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { status: "error", message: "Please enter your email and password." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { status: "error", message: "Incorrect email or password." };
  }

  await createSession(user.id);
  await mergeGuestCartIntoUser(user.id);

  redirect("/account");
}
