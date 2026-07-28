import Link from "next/link";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { formatMoney } from "@/lib/money";

export type ProductCardData = {
  name: string;
  slug: string;
  imageUrl: string | null;
  platform: string;
  fromPrice: number;
  currency: string;
  soldOut?: boolean;
};

export default function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group card overflow-hidden border hairline rounded-2xl bg-base-100 transition-all hover:border-primary/40 focus-visible:border-primary"
    >
      <figure className="relative aspect-video w-full overflow-hidden bg-base-300">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            quality={80}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <ImageOff className="size-8 opacity-30" />
          </div>
        )}
        <span className="font-mono text-[10px] uppercase tracking-wider bg-base-200/80 backdrop-blur-sm border hairline text-base-content/70 px-2 py-0.5 rounded absolute left-2 top-2">
          {product.platform}
        </span>
        {product.soldOut && (
          <span className="badge badge-error absolute right-2 top-2">
            Sold out
          </span>
        )}
      </figure>
      <div className="card-body gap-1 p-5">
        <h2 className="font-display font-semibold text-lg leading-tight">
          {product.name}
        </h2>
        <p className="font-mono text-sm text-base-content/55">
          from{" "}
          <span className="font-semibold text-primary">
            {formatMoney(product.fromPrice)}
          </span>
        </p>
      </div>
    </Link>
  );
}
