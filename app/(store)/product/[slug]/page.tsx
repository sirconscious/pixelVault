import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ImageOff, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { toNumber } from "@/lib/money";
import { getStoreSettings } from "@/lib/settings";
import ProductPurchase, {
  type PurchaseProduct,
} from "@/components/store/ProductPurchase";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  return { title: product ? `${product.name} — PixelVault` : "Product" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [product, settings] = await Promise.all([
    prisma.product.findFirst({
      where: { slug, isActive: true },
      include: {
        category: true,
        variants: { orderBy: { sortOrder: "asc" } },
      },
    }),
    getStoreSettings(),
  ]);

  if (!product) notFound();

  const purchaseProduct: PurchaseProduct = {
    name: product.name,
    slug: product.slug,
    imageUrl: product.imageUrl,
    variants: product.variants.map((v) => ({
      id: v.id,
      label: v.label,
      price: toNumber(v.price),
      currency: v.currency,
      inStock: v.inStock,
    })),
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 lg:py-14">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-1.5 text-sm font-mono text-base-content/50">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="size-3.5" />
        <Link href="/catalog" className="hover:text-primary transition-colors">
          Catalog
        </Link>
        <ChevronRight className="size-3.5" />
        <Link
          href={`/category/${product.category.slug}`}
          className="hover:text-primary transition-colors"
        >
          {product.category.name}
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-base-content/80 truncate">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-2xl border hairline bg-base-300">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <ImageOff className="size-12 opacity-30" />
            </div>
          )}
          <span className="font-mono text-[10px] uppercase tracking-wider bg-base-200/80 backdrop-blur-sm border hairline text-base-content/70 px-2.5 py-1 rounded absolute left-3 top-3">
            {product.platform}
          </span>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.22em] text-primary/80 mb-4 flex items-center gap-3">
              <span className="inline-block w-6 h-px bg-primary/60" />
              {product.category.name}
            </div>
            <h1 className="font-display font-semibold text-3xl lg:text-4xl tracking-tight">
              {product.name}
            </h1>
            {product.description && (
              <p className="mt-4 whitespace-pre-line text-base-content/65 text-base leading-relaxed">
                {product.description}
              </p>
            )}
          </div>

          <div className="border-t hairline" />

          <ProductPurchase
            product={purchaseProduct}
            whatsapp={{
              whatsappNumber: settings.whatsappNumber,
              whatsappGreeting: settings.whatsappGreeting,
            }}
          />
        </div>
      </div>
    </div>
  );
}
