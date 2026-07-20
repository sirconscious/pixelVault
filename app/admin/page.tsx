import Link from "next/link";
import {
  Package,
  FolderTree,
  PackageX,
  Settings,
  Plus,
  ArrowRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Overview — Admin" };

export default async function AdminOverviewPage() {
  const [productCount, categoryCount, outOfStock, settings] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.productVariant.count({ where: { inStock: false } }),
    prisma.storeSettings.findFirst(),
  ]);

  const stats = [
    { label: "Products", value: productCount, icon: Package, href: "/admin/products" },
    { label: "Categories", value: categoryCount, icon: FolderTree, href: "/admin/categories" },
    { label: "Out-of-stock variants", value: outOfStock, icon: PackageX, href: "/admin/products" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="text-sm opacity-70">
          Welcome back{settings?.storeName ? ` to ${settings.storeName}` : ""}.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="card bg-base-100 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="card-body flex-row items-center gap-4">
              <div className="rounded-box bg-primary/10 p-3 text-primary">
                <Icon className="size-6" />
              </div>
              <div>
                <div className="text-3xl font-bold">{value}</div>
                <div className="text-sm opacity-70">{label}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {!settings?.whatsappNumber && (
        <div className="alert alert-warning">
          <span>
            No WhatsApp number set — checkout won&apos;t work until you add one.
          </span>
          <Link href="/admin/settings" className="btn btn-sm">
            Set it now
          </Link>
        </div>
      )}

      <div>
        <h2 className="mb-3 font-semibold">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/products/new" className="btn btn-primary">
            <Plus className="size-4" />
            New product
          </Link>
          <Link href="/admin/categories" className="btn btn-outline">
            <FolderTree className="size-4" />
            Manage categories
          </Link>
          <Link href="/admin/settings" className="btn btn-outline">
            <Settings className="size-4" />
            Store settings
          </Link>
          <Link href="/" className="btn btn-ghost">
            View storefront
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
