import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";

export const metadata: Metadata = { title: "Forgot Password" };

export default async function ForgotPasswordPage() {
  const user = await getCurrentUser();
  if (user) redirect("/account");

  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <div className="rounded-2xl border border-zinc-200 p-6 sm:p-8 dark:border-zinc-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900">
          <Image
            src="/images/white-box-iphones-mark.png"
            alt=""
            width={40}
            height={40}
            className="h-8 w-8 object-contain"
          />
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight">Forgot your password?</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Enter your email and we&apos;ll send you a link to reset it.
        </p>
        <div className="mt-6">
          <ForgotPasswordForm />
        </div>
      </div>
      <p className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Remembered it?{" "}
        <Link href="/login" className="font-medium text-foreground underline underline-offset-2">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
