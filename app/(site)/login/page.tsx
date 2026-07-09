import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = { title: "Sign In" };

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/account");

  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <h1 className="text-2xl font-bold tracking-tight">Sign In</h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        New here?{" "}
        <Link href="/register" className="underline">
          Create an account
        </Link>
        .
      </p>
      <div className="mt-6">
        <LoginForm />
      </div>
    </div>
  );
}
