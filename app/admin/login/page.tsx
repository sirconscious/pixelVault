import Link from "next/link";
import { redirect } from "next/navigation";
import { Gamepad2 } from "lucide-react";
import { getSession } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const metadata = { title: "Admin Login" };

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <Link
            href="/"
            className="mb-2 flex items-center gap-2 text-primary"
          >
            <Gamepad2 className="size-6" />
            <span className="text-lg font-bold">PixelVault Admin</span>
          </Link>
          <h1 className="text-2xl font-bold">Sign in</h1>
          <p className="mb-4 text-sm opacity-70">
            Enter your admin credentials to manage the store.
          </p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
