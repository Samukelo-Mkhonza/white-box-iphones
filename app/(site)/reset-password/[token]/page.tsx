import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { findValidPasswordResetToken } from "@/lib/password-reset";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";

export const metadata: Metadata = { title: "Reset Password" };

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const resetToken = await findValidPasswordResetToken(token);

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
        {resetToken ? (
          <>
            <h1 className="mt-4 text-2xl font-bold tracking-tight">Set a new password</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Choose a new password for {resetToken.user.email}.
            </p>
            <div className="mt-6">
              <ResetPasswordForm token={token} />
            </div>
          </>
        ) : (
          <>
            <h1 className="mt-4 text-2xl font-bold tracking-tight">Link expired</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              This reset link is invalid, has expired, or was already used.
            </p>
            <Link
              href="/forgot-password"
              className="mt-6 block w-full rounded-full bg-foreground py-3 text-center text-sm font-medium text-background hover:opacity-80"
            >
              Request a New Link
            </Link>
          </>
        )}
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
