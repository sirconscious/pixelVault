"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { deleteBlobIfExists } from "@/lib/blob";
import { carouselImageSchema } from "@/lib/validation";
import type { ActionResult } from "@/lib/types";

async function requireAdmin() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
}

function parse(formData: FormData) {
  return carouselImageSchema.safeParse({
    title: formData.get("title"),
    subtitle: formData.get("subtitle") ?? "",
    imageUrl: formData.get("imageUrl"),
    link: formData.get("link") ?? "",
    sortOrder: formData.get("sortOrder") ?? 0,
    isActive: formData.get("isActive") === "on" || formData.get("isActive") === "true",
  });
}

function revalidate() {
  revalidatePath("/admin/carousel");
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function createCarouselImage(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  await prisma.carouselImage.create({ data: parsed.data });
  revalidate();
  return { ok: true, message: "Carousel image created" };
}

export async function updateCarouselImage(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const existing = await prisma.carouselImage.findUnique({ where: { id } });
  await prisma.carouselImage.update({ where: { id }, data: parsed.data });

  if (existing && existing.imageUrl !== parsed.data.imageUrl) {
    await deleteBlobIfExists(existing.imageUrl);
  }

  revalidate();
  return { ok: true, message: "Carousel image updated" };
}

export async function toggleCarouselImageActive(
  id: string,
  isActive: boolean,
): Promise<ActionResult> {
  await requireAdmin();
  await prisma.carouselImage.update({ where: { id }, data: { isActive } });
  revalidate();
  return { ok: true, message: isActive ? "Slide activated" : "Slide hidden" };
}

export async function deleteCarouselImage(id: string): Promise<ActionResult> {
  await requireAdmin();
  const existing = await prisma.carouselImage.findUnique({ where: { id } });
  await prisma.carouselImage.delete({ where: { id } });
  if (existing?.imageUrl) await deleteBlobIfExists(existing.imageUrl);
  revalidate();
  return { ok: true, message: "Carousel image deleted" };
}
