import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { RegisterForm } from "@/components/RegisterForm";

export const metadata: Metadata = { title: "Create Account" };

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) redirect("/account");

  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <h1 className="text-2xl font-bold tracking-tight">Create Account</h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Sign in
        </Link>
        .
      </p>
      <div className="mt-6">
        <RegisterForm />
      </div>
    </div>
  );
}
