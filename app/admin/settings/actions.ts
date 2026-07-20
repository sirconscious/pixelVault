"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { settingsSchema } from "@/lib/validation";
import { getStoreSettings } from "@/lib/settings";
import type { ActionResult } from "@/lib/types";

export async function updateSettings(formData: FormData): Promise<ActionResult> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const parsed = settingsSchema.safeParse({
    storeName: formData.get("storeName"),
    whatsappNumber: formData.get("whatsappNumber"),
    whatsappGreeting: formData.get("whatsappGreeting"),
    currency: formData.get("currency"),
  });

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      ok: false,
      error: issue?.message ?? "Invalid data",
      fieldErrors: issue?.path[0]
        ? { [String(issue.path[0])]: issue.message }
        : undefined,
    };
  }

  const current = await getStoreSettings();
  await prisma.storeSettings.update({
    where: { id: current.id },
    data: parsed.data,
  });

  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/cart");
  return { ok: true, message: "Settings saved" };
}
