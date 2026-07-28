"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Loader2, Save } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";
import { toast } from "@/components/ui/toast";
import { slugify } from "@/lib/slug";
import { productSchema, type ProductInput } from "@/lib/validation";
import { createProduct, updateProduct } from "./actions";

export type ProductFormData = {
  id?: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  platform: string;
  categoryId: string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  variants: {
    id?: string;
    label: string;
    price: number;
    currency: string;
    inStock: boolean;
  }[];
};

export default function ProductForm({
  initial,
  categories,
}: {
  initial?: ProductFormData;
  categories: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [slugEdited, setSlugEdited] = useState(!!initial);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<z.input<typeof productSchema>, unknown, ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initial?.name ?? "",
      slug: initial?.slug ?? "",
      description: initial?.description ?? "",
      imageUrl: initial?.imageUrl ?? "",
      platform: initial?.platform ?? "Steam",
      categoryId: initial?.categoryId ?? categories[0]?.id ?? "",
      isActive: initial?.isActive ?? true,
      isFeatured: initial?.isFeatured ?? false,
      sortOrder: initial?.sortOrder ?? 0,
      variants: initial?.variants ?? [
        { label: "", price: 0, currency: "MAD", inStock: true },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const nameValue = watch("name");

  const onSubmit = (values: ProductInput) => {
    const fd = new FormData();
    fd.set("name", values.name);
    fd.set("slug", values.slug);
    fd.set("description", values.description ?? "");
    fd.set("imageUrl", values.imageUrl ?? "");
    fd.set("platform", values.platform);
    fd.set("categoryId", values.categoryId);
    fd.set("isActive", values.isActive ? "true" : "false");
    fd.set("isFeatured", values.isFeatured ? "true" : "false");
    fd.set("sortOrder", String(values.sortOrder));
    fd.set("variants", JSON.stringify(values.variants));

    startTransition(async () => {
      const res = initial?.id
        ? await updateProduct(initial.id, fd)
        : await createProduct(fd);
      if (res.ok) {
        toast.success(res.message ?? "Saved");
        router.push("/admin/products");
        router.refresh();
      } else {
        if (res.fieldErrors?.slug) setError("slug", { message: res.fieldErrors.slug });
        toast.error(res.error ?? "Failed to save");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main details */}
        <div className="space-y-4 rounded-box border border-base-300 bg-base-100 p-5 lg:col-span-2">
          <h2 className="font-semibold">Details</h2>

          <Field label="Name" error={errors.name?.message}>
            <input
              className={`input input-bordered w-full ${errors.name ? "input-error" : ""}`}
              value={nameValue}
              onChange={(e) => {
                setValue("name", e.target.value);
                if (!slugEdited) setValue("slug", slugify(e.target.value));
              }}
            />
          </Field>

          <Field label="Slug" error={errors.slug?.message}>
            <input
              className={`input input-bordered w-full font-mono text-sm ${errors.slug ? "input-error" : ""}`}
              {...register("slug")}
              onChange={(e) => {
                setSlugEdited(true);
                setValue("slug", e.target.value);
              }}
            />
          </Field>

          <Field label="Description" error={errors.description?.message}>
            <textarea
              className="textarea textarea-bordered w-full"
              rows={4}
              {...register("description")}
            />
          </Field>

          <ImageUpload
            value={watch("imageUrl") ?? ""}
            onChange={(url) => setValue("imageUrl", url || null as unknown as string)}
            folder="products"
            label="Product image"
          />
        </div>

        {/* Meta */}
        <div className="space-y-4 rounded-box border border-base-300 bg-base-100 p-5">
          <h2 className="font-semibold">Settings</h2>

          <Field label="Category" error={errors.categoryId?.message}>
            <select
              className="select select-bordered w-full"
              {...register("categoryId")}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Platform" error={errors.platform?.message}>
            <input
              className={`input input-bordered w-full ${errors.platform ? "input-error" : ""}`}
              placeholder="Steam, Xbox, PC…"
              list="platforms"
              {...register("platform")}
            />
            <datalist id="platforms">
              <option value="Steam" />
              <option value="Xbox" />
              <option value="PC" />
              <option value="PlayStation" />
              <option value="Nintendo" />
            </datalist>
          </Field>

          <Field label="Sort order" error={errors.sortOrder?.message}>
            <input
              type="number"
              className="input input-bordered w-full"
              {...register("sortOrder")}
            />
          </Field>

          <label className="flex cursor-pointer items-center justify-between">
            <span className="text-sm">Active</span>
            <input type="checkbox" className="toggle toggle-success" {...register("isActive")} />
          </label>
          <label className="flex cursor-pointer items-center justify-between">
            <span className="text-sm">Featured</span>
            <input type="checkbox" className="toggle toggle-secondary" {...register("isFeatured")} />
          </label>
        </div>
      </div>

      {/* Variants */}
      <div className="space-y-4 rounded-box border border-base-300 bg-base-100 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Variants &amp; pricing</h2>
            <p className="text-sm opacity-70">
              Each variant is a purchasable option (e.g. &quot;25 DH&quot; or
              &quot;Deluxe Edition&quot;).
            </p>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={() =>
              append({ label: "", price: 0, currency: "MAD", inStock: true })
            }
          >
            <Plus className="size-4" />
            Add variant
          </button>
        </div>

        {typeof errors.variants?.message === "string" && (
          <div className="alert alert-error">
            <span>{errors.variants.message}</span>
          </div>
        )}

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 gap-3 rounded-box border border-base-300 p-3 sm:grid-cols-[1fr_auto_auto_auto_auto]"
            >
              <div>
                <input
                  className={`input input-bordered w-full ${errors.variants?.[index]?.label ? "input-error" : ""}`}
                  placeholder="Label (e.g. 25 DH)"
                  {...register(`variants.${index}.label` as const)}
                />
                {errors.variants?.[index]?.label && (
                  <span className="text-xs text-error">
                    {errors.variants[index]?.label?.message}
                  </span>
                )}
              </div>
              <input
                type="number"
                step="0.01"
                className={`input input-bordered w-28 ${errors.variants?.[index]?.price ? "input-error" : ""}`}
                placeholder="Price"
                {...register(`variants.${index}.price` as const)}
              />
              <input
                className="input input-bordered w-24"
                placeholder="MAD"
                {...register(`variants.${index}.currency` as const)}
              />
              <label className="flex items-center gap-2 px-1">
                <input
                  type="checkbox"
                  className="toggle toggle-success toggle-sm"
                  {...register(`variants.${index}.inStock` as const)}
                />
                <span className="text-xs">In stock</span>
              </label>
              <button
                type="button"
                className="btn btn-ghost btn-sm text-error"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
                aria-label="Remove variant"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {initial?.id ? "Save changes" : "Create product"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      {children}
      {error && <span className="mt-1 text-sm text-error">{error}</span>}
    </div>
  );
}
