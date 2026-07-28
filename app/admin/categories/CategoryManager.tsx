"use client";

import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import ConfirmButton from "@/components/ui/ConfirmButton";
import ImageUpload from "@/components/ui/ImageUpload";
import { toast } from "@/components/ui/toast";
import { slugify } from "@/lib/slug";
import { categorySchema, type CategoryInput } from "@/lib/validation";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryActive,
} from "./actions";

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
};

export default function CategoryManager({
  categories,
}: {
  categories: CategoryRow[];
}) {
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<CategoryRow | null>(null);
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(
      (c) => c.name.toLowerCase().includes(q) || c.slug.includes(q),
    );
  }, [categories, query]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="input input-bordered flex max-w-xs items-center gap-2">
          <Search className="size-4 opacity-60" />
          <input
            type="search"
            className="grow"
            placeholder="Search categories"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <button className="btn btn-primary" onClick={() => setCreating(true)}>
          <Plus className="size-4" />
          New category
        </button>
      </div>

      <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Products</th>
              <th>Order</th>
              <th>Active</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center opacity-60">
                  {categories.length === 0
                    ? "No categories yet — add your first one."
                    : "No categories match your search."}
                </td>
              </tr>
            )}
            {filtered.map((c) => (
              <CategoryTableRow
                key={c.id}
                category={c}
                onEdit={() => setEditing(c)}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="New category"
      >
        <CategoryForm
          onDone={() => setCreating(false)}
          submitLabel="Create category"
        />
      </Modal>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit category"
      >
        {editing && (
          <CategoryForm
            key={editing.id}
            initial={editing}
            onDone={() => setEditing(null)}
            submitLabel="Save changes"
          />
        )}
      </Modal>
    </div>
  );
}

function CategoryTableRow({
  category,
  onEdit,
}: {
  category: CategoryRow;
  onEdit: () => void;
}) {
  const [pending, startTransition] = useTransition();

  const toggle = () => {
    startTransition(async () => {
      const res = await toggleCategoryActive(category.id, !category.isActive);
      if (res.ok) toast.success(res.message ?? "Updated");
      else toast.error(res.error ?? "Failed");
    });
  };

  return (
    <tr>
      <td className="font-medium">{category.name}</td>
      <td className="font-mono text-xs opacity-70">{category.slug}</td>
      <td>
        <span className="badge badge-ghost">{category.productCount}</span>
      </td>
      <td>{category.sortOrder}</td>
      <td>
        <input
          type="checkbox"
          className="toggle toggle-success toggle-sm"
          checked={category.isActive}
          onChange={toggle}
          disabled={pending}
          aria-label="Toggle active"
        />
      </td>
      <td>
        <div className="flex justify-end gap-2">
          <button className="btn btn-ghost btn-sm" onClick={onEdit}>
            <Pencil className="size-4" />
          </button>
          <ConfirmButton
            action={() => deleteCategory(category.id)}
            confirmTitle="Delete category"
            confirmMessage={`Delete "${category.name}"? This cannot be undone.`}
            className="btn btn-ghost btn-sm text-error"
          >
            <Trash2 className="size-4" />
          </ConfirmButton>
        </div>
      </td>
    </tr>
  );
}

function CategoryForm({
  initial,
  onDone,
  submitLabel,
}: {
  initial?: CategoryRow;
  onDone: () => void;
  submitLabel: string;
}) {
  const [pending, startTransition] = useTransition();
  const [slugEdited, setSlugEdited] = useState(!!initial);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<z.input<typeof categorySchema>, unknown, CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initial?.name ?? "",
      slug: initial?.slug ?? "",
      description: initial?.description ?? "",
      imageUrl: initial?.imageUrl ?? "",
      sortOrder: initial?.sortOrder ?? 0,
      isActive: initial?.isActive ?? true,
    },
  });

  const nameValue = watch("name");

  const onNameChange = (v: string) => {
    setValue("name", v);
    if (!slugEdited) setValue("slug", slugify(v));
  };

  const onSubmit = (values: CategoryInput) => {
    const fd = new FormData();
    fd.set("name", values.name);
    fd.set("slug", values.slug);
    fd.set("description", values.description ?? "");
    fd.set("imageUrl", values.imageUrl ?? "");
    fd.set("sortOrder", String(values.sortOrder));
    fd.set("isActive", values.isActive ? "true" : "false");

    startTransition(async () => {
      const res = initial
        ? await updateCategory(initial.id, fd)
        : await createCategory(fd);
      if (res.ok) {
        toast.success(res.message ?? "Saved");
        onDone();
      } else {
        if (res.fieldErrors?.slug) {
          setError("slug", { message: res.fieldErrors.slug });
        }
        toast.error(res.error ?? "Failed to save");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
      <Field label="Name" error={errors.name?.message}>
        <input
          className={`input input-bordered w-full ${errors.name ? "input-error" : ""}`}
          value={nameValue}
          onChange={(e) => onNameChange(e.target.value)}
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
          rows={2}
          {...register("description")}
        />
      </Field>

      <ImageUpload
        value={watch("imageUrl") ?? ""}
        onChange={(url) => setValue("imageUrl", url || null as unknown as string)}
        folder="categories"
        label="Category image"
      />

      <div className="flex gap-3">
        <Field label="Sort order" error={errors.sortOrder?.message}>
          <input
            type="number"
            className="input input-bordered w-28"
            {...register("sortOrder")}
          />
        </Field>
        <label className="flex cursor-pointer items-center gap-2 pt-8">
          <input
            type="checkbox"
            className="toggle toggle-success"
            {...register("isActive")}
          />
          <span className="text-sm">Active</span>
        </label>
      </div>

      <div className="modal-action">
        <button type="button" className="btn btn-ghost" onClick={onDone}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending && <Loader2 className="size-4 animate-spin" />}
          {submitLabel}
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
