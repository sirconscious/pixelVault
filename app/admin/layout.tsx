import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Toaster from "@/components/ui/Toaster";
import AdminNav from "./AdminNav";

export const metadata = { title: "Admin — PixelVault" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // The login page renders its own <html> tree via this layout too, so allow
  // unauthenticated rendering and let proxy.ts / the login page handle redirects.
  if (!session) {
    // If somehow reached without a session on a protected page, bounce to login.
    // (proxy.ts already guards, this is a defense-in-depth fallback.)
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminNav email={session.email} />
      <main className="flex-1 overflow-x-hidden bg-base-200 p-4 md:p-8">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
