"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";

type ImageUploadProps = {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  className?: string;
};

export default function ImageUpload({
  value,
  onChange,
  folder = "uploads",
  label = "Image",
  className,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setUploading(true);
      try {
        const fd = new FormData();
        fd.set("file", file);
        fd.set("folder", folder);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Upload failed");
          return;
        }
        onChange(data.url);
      } catch {
        setError("Upload failed — try again");
      } finally {
        setUploading(false);
      }
    },
    [folder, onChange],
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  return (
    <div className={className}>
      <label className="label">
        <span className="label-text">{label}</span>
      </label>

      {value ? (
        <div className="relative group">
          <div className="relative h-40 w-full overflow-hidden rounded-box border border-base-300 bg-base-200">
            <Image
              src={value}
              alt={label}
              fill
              className="object-cover"
              sizes="320px"
              quality={80}
            />
          </div>
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              className="btn btn-xs btn-circle btn-ghost bg-base-100/80 backdrop-blur"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? <Loader2 className="size-3 animate-spin" /> : <Upload className="size-3" />}
            </button>
            <button
              type="button"
              className="btn btn-xs btn-circle btn-ghost bg-base-100/80 backdrop-blur text-error"
              onClick={() => onChange("")}
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center gap-2 rounded-box border-2 border-dashed border-base-300 bg-base-200 p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
        >
          {uploading ? (
            <Loader2 className="size-8 animate-spin opacity-40" />
          ) : (
            <Upload className="size-8 opacity-40" />
          )}
          <span className="text-sm opacity-60">
            {uploading ? "Uploading…" : "Click or drag to upload"}
          </span>
          <span className="text-xs opacity-40">JPEG, PNG, WebP or AVIF — max 10 MB</span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={onInputChange}
      />

      {error && <span className="mt-1 text-sm text-error">{error}</span>}
    </div>
  );
}
