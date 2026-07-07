"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { createReview, getUserReviewForProduct } from "@/lib/reviews";

export type ReviewFormState = {
  status: "idle" | "error" | "success";
  message?: string;
};

export async function submitReviewAction(
  productId: string,
  productSlug: string,
  _prevState: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  const user = await getCurrentUser();
  if (!user) {
    return { status: "error", message: "Please sign in to leave a review." };
  }

  const existing = await getUserReviewForProduct(user.id, productId);
  if (existing) {
    return { status: "error", message: "You've already reviewed this product." };
  }

  const rating = Number(formData.get("rating"));
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (!rating || rating < 1 || rating > 5) {
    return { status: "error", message: "Please choose a rating from 1 to 5." };
  }
  if (!title || !body) {
    return { status: "error", message: "Please fill in a title and review." };
  }

  await createReview(user.id, productId, rating, title, body);
  revalidatePath(`/product/${productSlug}`);

  return { status: "success", message: "Thanks! Your review is awaiting approval." };
}
