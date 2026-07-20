import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { toCardData } from "@/lib/catalog";
import ProductCard from "@/components/store/ProductCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return { title: "Category" };
  const description =
    category.description ||
    `Browse ${category.name} digital codes on PixelVault — delivered over WhatsApp.`;
  return {
    title: category.name,
    description,
    alternates: { canonical: `/category/${category.slug}` },
    openGraph: {
      title: category.name,
      description,
      type: "website",
    },
    twitter: { card: "summary_large_image", title: category.name, description },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await prisma.category.findFirst({
    where: { slug, isActive: true },
    include: {
      products: {
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        include: { variants: { orderBy: { sortOrder: "asc" } } },
      },
    },
  });

  if (!category) notFound();

  const products = category.products.map(toCardData);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://pixelvault-liart.vercel.app" },
      { "@type": "ListItem", position: 2, name: "Catalog", item: "https://pixelvault-liart.vercel.app/catalog" },
      { "@type": "ListItem", position: 3, name: category.name },
    ],
  };

  const itemListLd = products.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: category.name,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://pixelvault-liart.vercel.app/product/${p.slug}`,
      name: p.name,
    })),
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {itemListLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
        />
      )}
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
      {/* Breadcrumb */}
      <nav className="mb-10 flex items-center gap-1.5 text-sm font-mono text-base-content/50">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="size-3.5" />
        <Link href="/catalog" className="hover:text-primary transition-colors">
          Catalog
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-base-content/80">{category.name}</span>
      </nav>

      {/* Heading */}
      <div className="mb-14">
        <div className="font-mono text-xs uppercase tracking-[0.22em] text-primary/80 mb-5 flex items-center gap-3">
          <span className="inline-block w-6 h-px bg-primary/60" />
          {category.name}
        </div>
        <h1 className="font-display font-semibold text-4xl lg:text-5xl leading-tight tracking-tight">
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-4 max-w-2xl text-base-content/60 text-lg leading-relaxed">
            {category.description}
          </p>
        )}
      </div>

      {/* Products */}
      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed hairline p-16 text-center text-base-content/60">
          No products in this category yet.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
    </>
  );
}
