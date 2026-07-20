import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { toNumber } from "@/lib/money";
import ProductForm, { type ProductFormData } from "../ProductForm";

export const metadata = { title: "Edit product — Admin" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { variants: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!product) notFound();

  const initial: ProductFormData = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    imageUrl: product.imageUrl,
    platform: product.platform,
    categoryId: product.categoryId,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    sortOrder: product.sortOrder,
    variants: product.variants.map((v) => ({
      id: v.id,
      label: v.label,
      price: toNumber(v.price),
      currency: v.currency,
      inStock: v.inStock,
    })),
  };

  return (
    <div className="space-y-6">
      <Link href="/admin/products" className="btn btn-ghost btn-sm w-fit">
        <ArrowLeft className="size-4" />
        Back to products
      </Link>
      <h1 className="text-2xl font-bold">Edit product</h1>
      <ProductForm initial={initial} categories={categories} />
    </div>
  );
}
