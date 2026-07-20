"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSessionCookie, destroySessionCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";

export type LoginState = { error?: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Please enter a valid email and password." };
  }

  const { email, password } = parsed.data;
  const user = await prisma.adminUser.findUnique({
    where: { email: email.toLowerCase() },
  });

  // Constant-ish response to avoid leaking which part failed.
  const ok = user
    ? await bcrypt.compare(password, user.passwordHash)
    : false;

  if (!user || !ok) {
    return { error: "Invalid email or password." };
  }

  await createSessionCookie({ sub: user.id, email: user.email });
  redirect("/admin");
}

export async function logoutAction() {
  await destroySessionCookie();
  redirect("/admin/login");
}
