"use client";

import { useActionState, useState } from "react";
import {
  generateResetLinkAction,
  type ResetLinkFormState,
} from "@/app/admin/customers/actions";

const initialState: ResetLinkFormState = { status: "idle" };

export function GenerateResetLinkForm({ customerId }: { customerId: string }) {
  const boundAction = generateResetLinkAction.bind(null, customerId);
  const [state, action, pending] = useActionState<ResetLinkFormState, FormData>(
    boundAction,
    initialState
  );
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!state.resetUrl) return;
    await navigator.clipboard.writeText(state.resetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
      <h3 className="text-sm font-semibold">Password reset</h3>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        Generates a one-time reset link for this customer. Their password stays unchanged
        until they use it, and any older reset links stop working.
      </p>

      {state.status === "generated" && state.resetUrl ? (
        <div className="mt-3 space-y-2">
          <p className="text-xs text-emerald-700 dark:text-emerald-400">{state.message}</p>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={state.resetUrl}
              onFocus={(e) => e.currentTarget.select()}
              className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-xs dark:border-zinc-700"
            />
            <button
              type="button"
              onClick={copy}
              className="shrink-0 rounded-full border border-zinc-200 px-4 py-2 text-xs font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      ) : (
        <form action={action} className="mt-3">
          {state.status === "error" && (
            <p role="alert" className="mb-2 text-xs text-red-600 dark:text-red-400">
              {state.message}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background hover:opacity-80 disabled:opacity-50"
          >
            {pending ? "Generating..." : "Generate Reset Link"}
          </button>
        </form>
      )}
    </div>
  );
}
