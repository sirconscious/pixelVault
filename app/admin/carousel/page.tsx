import { prisma } from "@/lib/prisma";
import { getActiveCategories } from "@/lib/catalog";
import CarouselManager, { type CarouselRow } from "./CarouselManager";

export const metadata = { title: "Carousel — Admin" };

export default async function CarouselPage() {
  const [images, categories] = await Promise.all([
    prisma.carouselImage.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
    getActiveCategories(),
  ]);

  const rows: CarouselRow[] = images.map((img) => ({
    id: img.id,
    title: img.title,
    subtitle: img.subtitle,
    imageUrl: img.imageUrl,
    link: img.link,
    sortOrder: img.sortOrder,
    isActive: img.isActive,
  }));

  const categoryOptions = categories.map((c) => ({
    name: c.name,
    slug: c.slug,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Carousel banners</h1>
        <p className="text-sm opacity-70">
          Manage the hero carousel images on your storefront homepage.
        </p>
      </div>
      <CarouselManager images={rows} categories={categoryOptions} />
    </div>
  );
}
