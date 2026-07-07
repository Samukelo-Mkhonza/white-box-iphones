"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { toggleWishlist } from "@/lib/wishlist";

export async function toggleWishlistAction(productId: string): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  const saved = await toggleWishlist(user.id, productId);
  revalidatePath("/account/wishlist");
  return saved;
}

// Same effect as toggleWishlistAction, but void-returning so it can be bound
// directly to a <form action> (which requires a void/Promise<void> result).
export async function removeWishlistItemAction(productId: string): Promise<void> {
  await toggleWishlistAction(productId);
}
