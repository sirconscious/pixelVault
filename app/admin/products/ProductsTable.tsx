"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, Search, ImageOff } from "lucide-react";
import ConfirmButton from "@/components/ui/ConfirmButton";
import { toast } from "@/components/ui/toast";
import { formatMoney } from "@/lib/money";
import { deleteProduct, toggleProductFlag } from "./actions";

export type ProductRow = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  platform: string;
  categoryId: string;
  categoryName: string;
  variantCount: number;
  minPrice: number;
  maxPrice: number;
  currency: string;
  isActive: boolean;
  isFeatured: boolean;
};

export default function ProductsTable({
  products,
  categories,
}: {
  products: ProductRow[];
  categories: { id: string; name: string }[];
}) {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesQuery = !q || p.name.toLowerCase().includes(q);
      const matchesCat = !categoryId || p.categoryId === categoryId;
      return matchesQuery && matchesCat;
    });
  }, [products, query, categoryId]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="input input-bordered flex max-w-xs items-center gap-2">
          <Search className="size-4 opacity-60" />
          <input
            type="search"
            className="grow"
            placeholder="Search products"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <select
          className="select select-bordered w-full max-w-xs"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Category</th>
              <th>Platform</th>
              <th>Variants</th>
              <th>Price</th>
              <th>Active</th>
              <th>Featured</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="py-10 text-center opacity-60">
                  {products.length === 0
                    ? "No products yet — add your first one."
                    : "No products match your filters."}
                </td>
              </tr>
            )}
            {filtered.map((p) => (
              <ProductTableRow key={p.id} product={p} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductTableRow({ product: p }: { product: ProductRow }) {
  const [pending, startTransition] = useTransition();

  const flip = (field: "isActive" | "isFeatured", value: boolean) => {
    startTransition(async () => {
      const res = await toggleProductFlag(p.id, field, value);
      if (res.ok) toast.success(res.message ?? "Updated");
      else toast.error(res.error ?? "Failed");
    });
  };

  const priceLabel =
    p.variantCount === 0
      ? "—"
      : p.minPrice === p.maxPrice
        ? formatMoney(p.minPrice)
        : `${formatMoney(p.minPrice)} – ${formatMoney(p.maxPrice)}`;

  return (
    <tr>
      <td>
        <div className="relative size-10 overflow-hidden rounded bg-base-300">
          {p.imageUrl ? (
            <Image
              src={p.imageUrl}
              alt=""
              fill
              sizes="40px"
              className="object-cover"
            />
          ) : (
            <span className="flex size-full items-center justify-center">
              <ImageOff className="size-4 opacity-40" />
            </span>
          )}
        </div>
      </td>
      <td className="font-medium">{p.name}</td>
      <td>{p.categoryName}</td>
      <td>
        <span className="badge badge-outline">{p.platform}</span>
      </td>
      <td>{p.variantCount}</td>
      <td className="whitespace-nowrap">{priceLabel}</td>
      <td>
        <input
          type="checkbox"
          className="toggle toggle-success toggle-sm"
          checked={p.isActive}
          onChange={(e) => flip("isActive", e.target.checked)}
          disabled={pending}
          aria-label="Toggle active"
        />
      </td>
      <td>
        <input
          type="checkbox"
          className="toggle toggle-secondary toggle-sm"
          checked={p.isFeatured}
          onChange={(e) => flip("isFeatured", e.target.checked)}
          disabled={pending}
          aria-label="Toggle featured"
        />
      </td>
      <td>
        <div className="flex justify-end gap-2">
          <Link href={`/admin/products/${p.id}`} className="btn btn-ghost btn-sm">
            <Pencil className="size-4" />
          </Link>
          <ConfirmButton
            action={() => deleteProduct(p.id)}
            confirmTitle="Delete product"
            confirmMessage={`Delete "${p.name}" and all its variants? This cannot be undone.`}
            className="btn btn-ghost btn-sm text-error"
          >
            <Trash2 className="size-4" />
          </ConfirmButton>
        </div>
      </td>
    </tr>
  );
}
