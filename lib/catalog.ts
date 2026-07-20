import { prisma } from "./prisma";
import { toNumber } from "./money";
import type { ProductCardData } from "@/components/store/ProductCard";

type ProductWithVariants = {
  name: string;
  slug: string;
  imageUrl: string | null;
  platform: string;
  variants: { price: unknown; currency: string; inStock: boolean }[];
};

export function toCardData(p: ProductWithVariants): ProductCardData {
  const prices = p.variants.map((v) => toNumber(v.price as number));
  const fromPrice = prices.length ? Math.min(...prices) : 0;
  const soldOut = p.variants.length > 0 && p.variants.every((v) => !v.inStock);
  return {
    name: p.name,
    slug: p.slug,
    imageUrl: p.imageUrl,
    platform: p.platform,
    fromPrice,
    currency: p.variants[0]?.currency ?? "USD",
    soldOut,
  };
}

export async function getFeaturedProducts(limit = 6) {
  const products = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    orderBy: { sortOrder: "asc" },
    take: limit,
    include: { variants: { orderBy: { sortOrder: "asc" } } },
  });
  return products.map(toCardData);
}

export async function getActiveCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: { where: { isActive: true } } } } },
  });
}

export type CatalogCategory = {
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  platform: string | null;
  labels: string[];
  productCount: number;
};

/**
 * Active categories with a de-duplicated list of variant labels (denominations
 * / editions) drawn from their active products — used for the catalog cards.
 */
export async function getCatalogCategories(
  limit = 3,
): Promise<CatalogCategory[]> {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    take: limit,
    include: {
      products: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        include: { variants: { orderBy: { sortOrder: "asc" } } },
      },
    },
  });

  return categories.map((c) => {
    const labels: string[] = [];
    for (const product of c.products) {
      for (const v of product.variants) {
        if (!labels.includes(v.label)) labels.push(v.label);
      }
    }
    return {
      name: c.name,
      slug: c.slug,
      description: c.description,
      imageUrl: c.imageUrl,
      platform: c.products[0]?.platform ?? null,
      labels: labels.slice(0, 5),
      productCount: c.products.length,
    };
  });
}

/** All active categories — no limit. Used on the dedicated /catalog page. */
export async function getAllCatalogCategories(): Promise<CatalogCategory[]> {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      products: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        include: { variants: { orderBy: { sortOrder: "asc" } } },
      },
    },
  });

  return categories.map((c) => {
    const labels: string[] = [];
    for (const product of c.products) {
      for (const v of product.variants) {
        if (!labels.includes(v.label)) labels.push(v.label);
      }
    }
    return {
      name: c.name,
      slug: c.slug,
      description: c.description,
      imageUrl: c.imageUrl,
      platform: c.products[0]?.platform ?? null,
      labels: labels.slice(0, 5),
      productCount: c.products.length,
    };
  });
}
