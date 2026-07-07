"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import type { ReviewStatus } from "@prisma/client";

export async function moderateReviewAction(reviewId: string, status: ReviewStatus) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/login");

  await prisma.review.update({ where: { id: reviewId }, data: { status } });
  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
}
