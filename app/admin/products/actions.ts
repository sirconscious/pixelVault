"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { productSchema } from "@/lib/validation";
import type { ActionResult } from "@/lib/types";

async function requireAdmin() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
}

function revalidate() {
  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/");
}

function parse(formData: FormData) {
  let variants: unknown = [];
  try {
    variants = JSON.parse(String(formData.get("variants") ?? "[]"));
  } catch {
    variants = [];
  }

  return productSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") ?? "",
    imageUrl: formData.get("imageUrl") ?? "",
    platform: formData.get("platform"),
    categoryId: formData.get("categoryId"),
    isActive: formData.get("isActive") === "true",
    isFeatured: formData.get("isFeatured") === "true",
    sortOrder: formData.get("sortOrder") ?? 0,
    variants,
  });
}

export async function createProduct(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }
  const data = parsed.data;

  const existing = await prisma.product.findUnique({ where: { slug: data.slug } });
  if (existing) {
    return { ok: false, error: "That slug is already taken.", fieldErrors: { slug: "Slug already in use" } };
  }

  const created = await prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      imageUrl: data.imageUrl,
      platform: data.platform,
      categoryId: data.categoryId,
      isActive: data.isActive,
      isFeatured: data.isFeatured,
      sortOrder: data.sortOrder,
      variants: {
        create: data.variants.map((v, i) => ({
          label: v.label,
          price: v.price,
          currency: v.currency,
          inStock: v.inStock,
          sortOrder: i,
        })),
      },
    },
  });

  revalidate();
  revalidatePath(`/product/${created.slug}`);
  return { ok: true, message: "Product created" };
}

export async function updateProduct(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }
  const data = parsed.data;

  const clash = await prisma.product.findFirst({
    where: { slug: data.slug, NOT: { id } },
  });
  if (clash) {
    return { ok: false, error: "That slug is already taken.", fieldErrors: { slug: "Slug already in use" } };
  }

  // Replace variants wholesale for simplicity.
  await prisma.$transaction([
    prisma.productVariant.deleteMany({ where: { productId: id } }),
    prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        imageUrl: data.imageUrl,
        platform: data.platform,
        categoryId: data.categoryId,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        sortOrder: data.sortOrder,
        variants: {
          create: data.variants.map((v, i) => ({
            label: v.label,
            price: v.price,
            currency: v.currency,
            inStock: v.inStock,
            sortOrder: i,
          })),
        },
      },
    }),
  ]);

  revalidate();
  revalidatePath(`/product/${data.slug}`);
  return { ok: true, message: "Product updated" };
}

export async function toggleProductFlag(
  id: string,
  field: "isActive" | "isFeatured",
  value: boolean,
): Promise<ActionResult> {
  await requireAdmin();
  await prisma.product.update({ where: { id }, data: { [field]: value } });
  revalidate();
  return { ok: true, message: "Updated" };
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.product.delete({ where: { id } }); // variants cascade
  revalidate();
  return { ok: true, message: "Product deleted" };
}

export async function deleteProductAndRedirect(id: string) {
  await deleteProduct(id);
  redirect("/admin/products");
}
