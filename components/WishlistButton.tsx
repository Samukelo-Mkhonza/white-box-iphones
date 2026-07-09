"use client";

import { useState, useTransition } from "react";
import { toggleWishlistAction } from "@/app/(site)/wishlist/actions";

export function WishlistButton({
  productId,
  initialSaved,
}: {
  productId: string;
  initialSaved: boolean;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const nowSaved = await toggleWishlistAction(productId);
      setSaved(nowSaved);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="flex items-center gap-2 text-sm text-zinc-500 hover:text-foreground disabled:opacity-50 dark:text-zinc-400"
    >
      <span aria-hidden="true">{saved ? "★" : "☆"}</span>
      {saved ? "Saved to Wishlist" : "Add to Wishlist"}
    </button>
  );
}
