"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addToCart, updateCartItemQuantity, removeCartItem } from "@/lib/cart";

export async function addToCartAction(variantId: string, quantity: number) {
  await addToCart(variantId, quantity);
  revalidatePath("/", "layout");
}

export async function buyNowAction(variantId: string, quantity: number) {
  await addToCart(variantId, quantity);
  revalidatePath("/", "layout");
  redirect("/checkout");
}

export async function updateQuantityAction(itemId: string, formData: FormData) {
  const quantity = Number(formData.get("quantity"));
  await updateCartItemQuantity(itemId, quantity);
  revalidatePath("/cart");
  revalidatePath("/", "layout");
}

export async function removeItemAction(itemId: string) {
  await removeCartItem(itemId);
  revalidatePath("/cart");
  revalidatePath("/", "layout");
}
