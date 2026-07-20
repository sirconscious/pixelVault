"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderTree,
  Package,
  Settings,
  LogOut,
  Gamepad2,
  Store,
} from "lucide-react";
import { logoutAction } from "./login/actions";

const LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="flex w-full flex-col gap-4 border-b border-base-300 bg-base-100 p-4 md:h-screen md:w-64 md:border-b-0 md:border-r">
      <Link href="/admin" className="flex items-center gap-2 text-primary">
        <Gamepad2 className="size-6" />
        <span className="text-lg font-bold">PixelVault</span>
      </Link>

      <nav className="flex flex-row gap-1 overflow-x-auto md:flex-col">
        {LINKS.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-btn px-3 py-2 text-sm whitespace-nowrap transition-colors ${
              isActive(href, exact)
                ? "bg-primary text-primary-content"
                : "hover:bg-base-200"
            }`}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto space-y-2">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-btn px-3 py-2 text-sm hover:bg-base-200"
        >
          <Store className="size-4" />
          View store
        </Link>
        <div className="truncate px-3 text-xs opacity-60">{email}</div>
        <form action={logoutAction}>
          <button type="submit" className="btn btn-ghost btn-sm w-full justify-start">
            <LogOut className="size-4" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
