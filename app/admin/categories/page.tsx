import { prisma } from "@/lib/prisma";
import CategoryManager, { type CategoryRow } from "./CategoryManager";

export const metadata = { title: "Categories — Admin" };

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } },
  });

  const rows: CategoryRow[] = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    imageUrl: c.imageUrl,
    sortOrder: c.sortOrder,
    isActive: c.isActive,
    productCount: c._count.products,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Categories</h1>
        <p className="text-sm opacity-70">
          Organize your products into storefront categories.
        </p>
      </div>
      <CategoryManager categories={rows} />
    </div>
  );
}
