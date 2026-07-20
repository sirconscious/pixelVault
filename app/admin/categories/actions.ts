"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { categorySchema } from "@/lib/validation";
import type { ActionResult } from "@/lib/types";

async function requireAdmin() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
}

function parse(formData: FormData) {
  return categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") ?? "",
    imageUrl: formData.get("imageUrl") ?? "",
    sortOrder: formData.get("sortOrder") ?? 0,
    isActive: formData.get("isActive") === "on" || formData.get("isActive") === "true",
  });
}

function revalidate() {
  revalidatePath("/admin/categories");
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function createCategory(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const existing = await prisma.category.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (existing) {
    return { ok: false, error: "That slug is already taken.", fieldErrors: { slug: "Slug already in use" } };
  }

  await prisma.category.create({ data: parsed.data });
  revalidate();
  return { ok: true, message: "Category created" };
}

export async function updateCategory(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const clash = await prisma.category.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  });
  if (clash) {
    return { ok: false, error: "That slug is already taken.", fieldErrors: { slug: "Slug already in use" } };
  }

  await prisma.category.update({ where: { id }, data: parsed.data });
  revalidate();
  return { ok: true, message: "Category updated" };
}

export async function toggleCategoryActive(
  id: string,
  isActive: boolean,
): Promise<ActionResult> {
  await requireAdmin();
  await prisma.category.update({ where: { id }, data: { isActive } });
  revalidate();
  return { ok: true, message: isActive ? "Category activated" : "Category hidden" };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  await requireAdmin();
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) {
    return {
      ok: false,
      error: `Cannot delete — ${count} product(s) still use this category. Reassign or remove them first.`,
    };
  }
  await prisma.category.delete({ where: { id } });
  revalidate();
  return { ok: true, message: "Category deleted" };
}
