"use client";

import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, Trash2, Search, Loader2, Image as ImageIcon } from "lucide-react";
import Modal from "@/components/ui/Modal";
import ConfirmButton from "@/components/ui/ConfirmButton";
import ImageUpload from "@/components/ui/ImageUpload";
import { toast } from "@/components/ui/toast";
import {
  carouselImageSchema,
  type CarouselImageInput,
} from "@/lib/validation";
import {
  createCarouselImage,
  updateCarouselImage,
  deleteCarouselImage,
  toggleCarouselImageActive,
} from "./actions";

export type CategoryOption = { name: string; slug: string };

export type CarouselRow = {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  link: string | null;
  sortOrder: number;
  isActive: boolean;
};

function linkToCategoryName(link: string | null, categories: CategoryOption[]): string {
  if (!link) return "—";
  const slug = link.replace("/category/", "");
  const cat = categories.find((c) => c.slug === slug);
  return cat?.name ?? slug;
}

export default function CarouselManager({
  images,
  categories,
}: {
  images: CarouselRow[];
  categories: CategoryOption[];
}) {
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<CarouselRow | null>(null);
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return images;
    return images.filter(
      (img) =>
        img.title.toLowerCase().includes(q) ||
        img.subtitle?.toLowerCase().includes(q),
    );
  }, [images, query]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="input input-bordered flex max-w-xs items-center gap-2">
          <Search className="size-4 opacity-60" />
          <input
            type="search"
            className="grow"
            placeholder="Search slides"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <button className="btn btn-primary" onClick={() => setCreating(true)}>
          <Plus className="size-4" />
          New slide
        </button>
      </div>

      {images.length === 0 ? (
        <div className="rounded-box border border-dashed border-base-300 bg-base-100 p-12 text-center">
          <ImageIcon className="mx-auto mb-3 size-10 opacity-30" />
          <p className="opacity-60">
            No carousel images yet — add your first slide.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
          <table className="table">
            <thead>
              <tr>
                <th>Preview</th>
                <th>Title</th>
                <th>Category</th>
                <th>Order</th>
                <th>Active</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center opacity-60">
                    No slides match your search.
                  </td>
                </tr>
              )}
              {filtered.map((img) => (
                <CarouselTableRow
                  key={img.id}
                  image={img}
                  categories={categories}
                  onEdit={() => setEditing(img)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="New carousel slide"
      >
        <CarouselForm
          categories={categories}
          onDone={() => setCreating(false)}
          submitLabel="Create slide"
        />
      </Modal>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit carousel slide"
      >
        {editing && (
          <CarouselForm
            key={editing.id}
            initial={editing}
            categories={categories}
            onDone={() => setEditing(null)}
            submitLabel="Save changes"
          />
        )}
      </Modal>
    </div>
  );
}

function CarouselTableRow({
  image,
  categories,
  onEdit,
}: {
  image: CarouselRow;
  categories: CategoryOption[];
  onEdit: () => void;
}) {
  const [pending, startTransition] = useTransition();

  const toggle = () => {
    startTransition(async () => {
      const res = await toggleCarouselImageActive(image.id, !image.isActive);
      if (res.ok) toast.success(res.message ?? "Updated");
      else toast.error(res.error ?? "Failed");
    });
  };

  return (
    <tr>
      <td>
        <div className="relative h-14 w-24 overflow-hidden rounded-md bg-base-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.imageUrl}
            alt={image.title}
            className="h-full w-full object-cover"
          />
        </div>
      </td>
      <td className="font-medium">{image.title}</td>
      <td className="font-mono text-xs opacity-70">
        {linkToCategoryName(image.link, categories)}
      </td>
      <td>{image.sortOrder}</td>
      <td>
        <input
          type="checkbox"
          className="toggle toggle-success toggle-sm"
          checked={image.isActive}
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
            action={() => deleteCarouselImage(image.id)}
            confirmTitle="Delete slide"
            confirmMessage={`Delete "${image.title}"? This cannot be undone.`}
            className="btn btn-ghost btn-sm text-error"
          >
            <Trash2 className="size-4" />
          </ConfirmButton>
        </div>
      </td>
    </tr>
  );
}

function CarouselForm({
  initial,
  categories,
  onDone,
  submitLabel,
}: {
  initial?: CarouselRow;
  categories: CategoryOption[];
  onDone: () => void;
  submitLabel: string;
}) {
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.input<typeof carouselImageSchema>, unknown, CarouselImageInput>({
    resolver: zodResolver(carouselImageSchema),
    defaultValues: {
      title: initial?.title ?? "",
      subtitle: initial?.subtitle ?? "",
      imageUrl: initial?.imageUrl ?? "",
      link: initial?.link ?? "",
      sortOrder: initial?.sortOrder ?? 0,
      isActive: initial?.isActive ?? true,
    },
  });

  const onSubmit = (values: CarouselImageInput) => {
    const fd = new FormData();
    fd.set("title", values.title);
    fd.set("subtitle", values.subtitle ?? "");
    fd.set("imageUrl", values.imageUrl);
    fd.set("link", values.link ?? "");
    fd.set("sortOrder", String(values.sortOrder));
    fd.set("isActive", values.isActive ? "true" : "false");

    startTransition(async () => {
      const res = initial
        ? await updateCarouselImage(initial.id, fd)
        : await createCarouselImage(fd);
      if (res.ok) {
        toast.success(res.message ?? "Saved");
        onDone();
      } else {
        if (res.fieldErrors?.imageUrl) {
          setError("imageUrl", { message: res.fieldErrors.imageUrl });
        }
        toast.error(res.error ?? "Failed to save");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
      <Field label="Title" error={errors.title?.message}>
        <input
          className={`input input-bordered w-full ${errors.title ? "input-error" : ""}`}
          placeholder="Summer Sale — Up to 50% Off"
          {...register("title")}
        />
      </Field>

      <Field label="Subtitle" error={errors.subtitle?.message}>
        <input
          className="input input-bordered w-full"
          placeholder="Limited time offer on select games"
          {...register("subtitle")}
        />
      </Field>

      <ImageUpload
        value={watch("imageUrl") ?? ""}
        onChange={(url) => setValue("imageUrl", url)}
        folder="carousel"
        label="Slide image"
      />

      <Field
        label="Category"
        error={errors.link?.message}
        hint="Choose where clicking the slide takes the visitor."
      >
        <select
          className="select select-bordered w-full"
          {...register("link")}
        >
          <option value="">No link</option>
          {categories.map((c) => (
            <option key={c.slug} value={`/category/${c.slug}`}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>

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
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      {children}
      {hint && !error && <span className="mt-1 text-xs opacity-60">{hint}</span>}
      {error && <span className="mt-1 text-sm text-error">{error}</span>}
    </div>
  );
}
