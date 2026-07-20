import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductForm from "../ProductForm";

export const metadata = { title: "New product — Admin" };

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="space-y-6">
      <Link href="/admin/products" className="btn btn-ghost btn-sm w-fit">
        <ArrowLeft className="size-4" />
        Back to products
      </Link>
      <h1 className="text-2xl font-bold">New product</h1>

      {categories.length === 0 ? (
        <div className="alert alert-warning">
          <span>
            You need at least one category first.{" "}
            <Link href="/admin/categories" className="link">
              Create a category
            </Link>
            .
          </span>
        </div>
      ) : (
        <ProductForm categories={categories} />
      )}
    </div>
  );
}
