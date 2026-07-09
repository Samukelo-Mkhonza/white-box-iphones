import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { RegisterForm } from "@/components/RegisterForm";

export const metadata: Metadata = { title: "Create Account" };

const PERKS = ["Track orders and see your full history", "Save phones to a wishlist", "Faster checkout next time"];

export default async function RegisterPage() {
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
        <h1 className="mt-4 text-2xl font-bold tracking-tight">Create Account</h1>
        <ul className="mt-3 space-y-1.5 text-sm text-zinc-500 dark:text-zinc-400">
          {PERKS.map((perk) => (
            <li key={perk} className="flex items-center gap-2">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                aria-hidden="true"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
              {perk}
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <RegisterForm />
        </div>
      </div>
      <p className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-foreground underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </div>
  );
}
