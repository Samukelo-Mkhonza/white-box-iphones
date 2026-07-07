"use client";

import { useActionState } from "react";
import { submitReviewAction, type ReviewFormState } from "@/app/reviews/actions";

const initialState: ReviewFormState = { status: "idle" };

export function ReviewForm({ productId, productSlug }: { productId: string; productSlug: string }) {
  const boundAction = submitReviewAction.bind(null, productId, productSlug);
  const [state, action, pending] = useActionState(boundAction, initialState);

  if (state.status === "success") {
    return (
      <p className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
        {state.message}
      </p>
    );
  }

  return (
    <form action={action} className="space-y-3 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
      <div>
        <label htmlFor="rating" className="mb-1 block text-sm font-medium">
          Rating
        </label>
        <select
          id="rating"
          name="rating"
          defaultValue=""
          required
          className="rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
        >
          <option value="" disabled>
            Choose a rating
          </option>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} star{n === 1 ? "" : "s"}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
        />
      </div>
      <div>
        <label htmlFor="body" className="mb-1 block text-sm font-medium">
          Review
        </label>
        <textarea
          id="body"
          name="body"
          rows={4}
          required
          className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
        />
      </div>

      {state.status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background hover:opacity-80 disabled:opacity-50"
      >
        {pending ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
