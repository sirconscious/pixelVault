import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { toNumber } from "@/lib/money";
import ProductsTable, { type ProductRow } from "./ProductsTable";

export const metadata = { title: "Products — Admin" };

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: {
        category: { select: { name: true } },
        variants: { select: { price: true, currency: true } },
      },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const rows: ProductRow[] = products.map((p) => {
    const prices = p.variants.map((v) => toNumber(v.price));
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      imageUrl: p.imageUrl,
      platform: p.platform,
      categoryId: p.categoryId,
      categoryName: p.category.name,
      variantCount: p.variants.length,
      minPrice: prices.length ? Math.min(...prices) : 0,
      maxPrice: prices.length ? Math.max(...prices) : 0,
      currency: p.variants[0]?.currency ?? "MAD",
      isActive: p.isActive,
      isFeatured: p.isFeatured,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm opacity-70">Manage your catalog and pricing.</p>
        </div>
        <Link href="/admin/products/new" className="btn btn-primary">
          <Plus className="size-4" />
          New product
        </Link>
      </div>

      <ProductsTable products={rows} categories={categories} />
    </div>
  );
}
