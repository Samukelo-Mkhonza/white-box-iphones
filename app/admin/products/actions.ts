"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile, mkdir, unlink } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { slugify } from "@/lib/slug";
import type { Condition } from "@prisma/client";

export type FormState = {
  status: "idle" | "error";
  message?: string;
};

async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/login");
  return admin;
}

export async function createProductAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const series = String(formData.get("series") ?? "").trim();
  const brandId = String(formData.get("brandId") ?? "");
  const categoryId = String(formData.get("categoryId") ?? "");
  const description = String(formData.get("description") ?? "").trim();
  const specifications = String(formData.get("specifications") ?? "{}").trim();

  if (!name || !series || !brandId || !categoryId || !description) {
    return { status: "error", message: "Please fill in all required fields." };
  }
  try {
    JSON.parse(specifications || "{}");
  } catch {
    return { status: "error", message: "Specifications must be valid JSON." };
  }

  const slug = slugify(name);
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    return { status: "error", message: "A product with a similar name already exists." };
  }

  const product = await prisma.product.create({
    data: {
      slug,
      name,
      series,
      brandId,
      categoryId,
      description,
      specifications: specifications || "{}",
    },
  });

  revalidatePath("/admin/products");
  redirect(`/admin/products/${product.id}/edit`);
}

export async function updateProductAction(
  productId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const series = String(formData.get("series") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const specifications = String(formData.get("specifications") ?? "{}").trim();
  const isPublished = formData.get("isPublished") === "on";

  if (!name || !series || !description) {
    return { status: "error", message: "Please fill in all required fields." };
  }
  try {
    JSON.parse(specifications || "{}");
  } catch {
    return { status: "error", message: "Specifications must be valid JSON." };
  }

  await prisma.product.update({
    where: { id: productId },
    data: { name, series, description, specifications: specifications || "{}", isPublished },
  });

  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath("/admin/products");
  return { status: "idle", message: "Saved." };
}

export async function deleteProductAction(productId: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id: productId } });
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function createColourwayAction(productId: string, formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const hexCode = String(formData.get("hexCode") ?? "").trim();
  if (!name || !hexCode) return;

  await prisma.colourway.create({
    data: { productId, name, hexCode: hexCode.startsWith("#") ? hexCode : `#${hexCode}` },
  });

  revalidatePath(`/admin/products/${productId}/edit`);
}

export async function deleteColourwayAction(productId: string, colourwayId: string) {
  await requireAdmin();
  await prisma.colourway.delete({ where: { id: colourwayId } });
  revalidatePath(`/admin/products/${productId}/edit`);
}

async function saveUploadedFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = path.extname(file.name) || ".jpg";
  const filename = `${randomUUID()}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);
  return `/uploads/${filename}`;
}

export async function uploadColourwayImageAction(
  productId: string,
  colourwayId: string,
  formData: FormData
) {
  await requireAdmin();

  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) return;

  const url = await saveUploadedFile(file);
  const position = await prisma.productImage.count({ where: { colourwayId } });

  await prisma.productImage.create({
    data: { colourwayId, url, altText: file.name, position },
  });

  revalidatePath(`/admin/products/${productId}/edit`);
}

export async function deleteImageAction(productId: string, imageId: string) {
  await requireAdmin();
  const image = await prisma.productImage.findUnique({ where: { id: imageId } });
  if (image?.url.startsWith("/uploads/")) {
    await unlink(path.join(process.cwd(), "public", image.url)).catch(() => {});
  }
  await prisma.productImage.delete({ where: { id: imageId } });
  revalidatePath(`/admin/products/${productId}/edit`);
}

export async function createVariantAction(productId: string, formData: FormData) {
  await requireAdmin();

  const colourwayId = String(formData.get("colourwayId") ?? "");
  const storageGb = Number(formData.get("storageGb"));
  const condition = String(formData.get("condition") ?? "") as Condition;
  const priceRand = Number(formData.get("priceRand"));
  const stockQty = Number(formData.get("stockQty"));
  const batteryHealthPct = Number(formData.get("batteryHealthPct"));

  if (!colourwayId || !storageGb || !condition || !priceRand || Number.isNaN(stockQty) || !batteryHealthPct) {
    return;
  }

  const colourway = await prisma.colourway.findUnique({ where: { id: colourwayId }, include: { product: true } });
  if (!colourway) return;

  const sku = `${colourway.product.slug}-${storageGb}-${slugify(colourway.name)}-${condition}`.toUpperCase();

  await prisma.productVariant.create({
    data: {
      productId,
      colourwayId,
      storageGb,
      condition,
      priceCents: Math.round(priceRand * 100),
      stockQty,
      batteryHealthPct,
      sku,
    },
  });

  revalidatePath(`/admin/products/${productId}/edit`);
}

export async function updateVariantAction(productId: string, variantId: string, formData: FormData) {
  await requireAdmin();

  const priceRand = Number(formData.get("priceRand"));
  const stockQty = Number(formData.get("stockQty"));
  const batteryHealthPct = Number(formData.get("batteryHealthPct"));

  if (!priceRand || Number.isNaN(stockQty) || !batteryHealthPct) return;

  await prisma.productVariant.update({
    where: { id: variantId },
    data: {
      priceCents: Math.round(priceRand * 100),
      stockQty,
      batteryHealthPct,
    },
  });

  revalidatePath(`/admin/products/${productId}/edit`);
}

export async function deleteVariantAction(productId: string, variantId: string) {
  await requireAdmin();
  await prisma.productVariant.delete({ where: { id: variantId } });
  revalidatePath(`/admin/products/${productId}/edit`);
}
