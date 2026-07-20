import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

const slugField = z
  .string()
  .min(1, "Slug is required")
  .max(120)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers and hyphens only",
  );

const optionalUrl = z
  .string()
  .trim()
  .url("Enter a valid URL")
  .or(z.literal(""))
  .optional()
  .transform((v) => (v ? v : null));

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(80),
  slug: slugField,
  description: z
    .string()
    .max(500)
    .optional()
    .transform((v) => (v ? v : null)),
  imageUrl: optionalUrl,
  sortOrder: z.coerce.number().int().min(0).default(0),
  isActive: z.coerce.boolean().default(true),
});
export type CategoryInput = z.infer<typeof categorySchema>;

export const variantSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1, "Label is required").max(80),
  price: z.coerce.number().min(0, "Price must be >= 0"),
  currency: z.string().min(1).max(8).default("USD"),
  inStock: z.coerce.boolean().default(true),
});
export type VariantInput = z.infer<typeof variantSchema>;

export const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  slug: slugField,
  description: z
    .string()
    .max(2000)
    .optional()
    .transform((v) => (v ? v : null)),
  imageUrl: optionalUrl,
  platform: z.string().min(1, "Platform is required").max(40),
  categoryId: z.string().min(1, "Category is required"),
  isActive: z.coerce.boolean().default(true),
  isFeatured: z.coerce.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).default(0),
  variants: z.array(variantSchema).min(1, "Add at least one variant"),
});
export type ProductInput = z.infer<typeof productSchema>;

export const settingsSchema = z.object({
  storeName: z.string().min(1, "Store name is required").max(80),
  whatsappNumber: z
    .string()
    .min(6, "Enter the full number in international format")
    .regex(/^[0-9]{6,15}$/, "Digits only, no + or spaces (e.g. 212600000000)"),
  whatsappGreeting: z.string().min(1, "Greeting is required").max(200),
  currency: z.string().min(1).max(8).default("USD"),
});
export type SettingsInput = z.infer<typeof settingsSchema>;
