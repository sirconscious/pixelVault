import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getAllCatalogCategories } from "@/lib/catalog";
import CategoryImage from "@/components/store/CategoryImage";

export const metadata: Metadata = {
  title: "Catalog — PixelVault",
  description:
    "Browse all available categories — Steam Wallet, Xbox Gift Cards, PC game keys, and more. Digital codes delivered over WhatsApp.",
};

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

export default async function CatalogPage() {
  const categories = await getAllCatalogCategories();

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
      {/* Breadcrumb */}
      <nav className="mb-10 flex items-center gap-1.5 text-sm font-mono text-base-content/50">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-base-content/80">Catalog</span>
      </nav>

      {/* Heading */}
      <div className="mb-14">
        <div className="font-mono text-xs uppercase tracking-[0.22em] text-primary/80 mb-5 flex items-center gap-3">
          <span className="inline-block w-6 h-px bg-primary/60" />
          All categories
        </div>
        <h1 className="font-display font-semibold text-4xl lg:text-5xl leading-tight tracking-tight max-w-2xl">
          Pick a shelf, mix across them.
        </h1>
        <p className="mt-4 max-w-2xl text-base-content/60 text-lg leading-relaxed">
          Browse every category we stock. Tap into one to see all products and
          variant options, then send your order over WhatsApp.
        </p>
      </div>

      {/* Category grid */}
      {categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed hairline p-16 text-center text-base-content/60">
          No categories yet.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="card bg-base-100 border hairline rounded-2xl hover:border-primary/40 transition-colors group overflow-hidden"
            >
              {c.imageUrl && (
                <div className="w-full h-44 overflow-hidden bg-base-200">
                  <CategoryImage
                    src={c.imageUrl}
                    alt={c.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="card-body p-7">
                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono text-xs uppercase tracking-wider text-base-content/50 px-2.5 py-1 rounded border hairline">
                    {(c.platform ?? c.name).slice(0, 12)}
                  </span>
                  <span className="font-mono text-[10px] text-base-content/35">
                    {c.productCount} item{c.productCount === 1 ? "" : "s"}
                  </span>
                </div>

                <h2 className="font-display text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {c.name}
                </h2>

                <p className="text-base-content/55 text-sm leading-relaxed mb-6">
                  {c.description ??
                    "Digital codes delivered as plain text over WhatsApp."}
                </p>

                {c.labels.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {c.labels.map((label, i) => (
                      <span
                        key={label}
                        className={`badge badge-sm font-mono ${
                          i === c.labels.length - 1
                            ? "bg-primary/15 border border-primary/30 text-primary"
                            : "bg-base-200 border hairline text-base-content/70"
                        }`}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                )}

                <div className="card-actions mt-auto pt-5 border-t hairline">
                  <span className="font-mono text-sm text-base-content/80 group-hover:text-primary transition-colors flex items-center gap-2">
                    Browse {c.name}
                    <Arrow className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
