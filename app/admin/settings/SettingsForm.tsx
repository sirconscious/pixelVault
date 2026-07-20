"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { settingsSchema, type SettingsInput } from "@/lib/validation";
import { updateSettings } from "./actions";

export default function SettingsForm({ initial }: { initial: SettingsInput }) {
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<z.input<typeof settingsSchema>, unknown, SettingsInput>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initial,
  });

  const onSubmit = (values: SettingsInput) => {
    const fd = new FormData();
    fd.set("storeName", values.storeName);
    fd.set("whatsappNumber", values.whatsappNumber);
    fd.set("whatsappGreeting", values.whatsappGreeting);
    fd.set("currency", values.currency);

    startTransition(async () => {
      const res = await updateSettings(fd);
      if (res.ok) toast.success(res.message ?? "Saved");
      else {
        if (res.fieldErrors?.whatsappNumber)
          setError("whatsappNumber", { message: res.fieldErrors.whatsappNumber });
        toast.error(res.error ?? "Failed to save");
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl space-y-4 rounded-box border border-base-300 bg-base-100 p-5"
      noValidate
    >
      <Field label="Store name" error={errors.storeName?.message}>
        <input
          className={`input input-bordered w-full ${errors.storeName ? "input-error" : ""}`}
          {...register("storeName")}
        />
      </Field>

      <Field
        label="WhatsApp number"
        error={errors.whatsappNumber?.message}
        hint="International format, digits only — no + or spaces (e.g. 212600000000)."
      >
        <input
          className={`input input-bordered w-full font-mono ${errors.whatsappNumber ? "input-error" : ""}`}
          placeholder="212600000000"
          inputMode="numeric"
          {...register("whatsappNumber")}
        />
      </Field>

      <Field
        label="Greeting message"
        error={errors.whatsappGreeting?.message}
        hint="Shown at the top of the WhatsApp order message."
      >
        <textarea
          className="textarea textarea-bordered w-full"
          rows={2}
          {...register("whatsappGreeting")}
        />
      </Field>

      <Field label="Currency" error={errors.currency?.message}>
        <input
          className="input input-bordered w-32"
          {...register("currency")}
        />
      </Field>

      <div className="pt-2">
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Save settings
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
