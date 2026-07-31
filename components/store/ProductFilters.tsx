"use client";

import { useMemo, useState } from "react";
import ProductCard, { type ProductCardData } from "@/components/store/ProductCard";
import { SlidersHorizontal } from "lucide-react";

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name A–Z" },
];

export default function ProductFilters({
  products,
  platforms,
}: {
  products: ProductCardData[];
  platforms: string[];
}) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(new Set());
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");

  const filtered = useMemo(() => {
    const min = minPrice === "" ? null : Number(minPrice);
    const max = maxPrice === "" ? null : Number(maxPrice);

    let list = products.filter((p) => {
      if (selectedPlatforms.size > 0 && !selectedPlatforms.has(p.platform)) return false;
      if (inStockOnly && p.soldOut) return false;
      if (min !== null && p.fromPrice < min) return false;
      if (max !== null && p.fromPrice > max) return false;
      return true;
    });

    if (sort === "price-asc") list = [...list].sort((a, b) => a.fromPrice - b.fromPrice);
    else if (sort === "price-desc") list = [...list].sort((a, b) => b.fromPrice - a.fromPrice);
    else if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [products, selectedPlatforms, inStockOnly, minPrice, maxPrice, sort]);

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(platform)) next.delete(platform);
      else next.add(platform);
      return next;
    });
  };

  const hasActiveFilters =
    selectedPlatforms.size > 0 || inStockOnly || minPrice !== "" || maxPrice !== "" || sort !== "featured";

  const clearAll = () => {
    setSelectedPlatforms(new Set());
    setInStockOnly(false);
    setMinPrice("");
    setMaxPrice("");
    setSort("featured");
  };

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4 mb-8 border hairline rounded-2xl bg-base-100 px-5 py-4">
        {/* Sort */}
        <label className="flex items-center gap-2.5">
          <span className="font-mono text-xs uppercase tracking-wider text-base-content/50 hidden sm:inline">
            Sort
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="select select-sm select-ghost font-mono text-sm pr-8"
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        {/* Platform chips */}
        {platforms.length > 1 && (
          <div className="flex items-center flex-wrap gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-base-content/50 mr-1 hidden sm:inline">
              Platform
            </span>
            {platforms.map((platform) => {
              const active = selectedPlatforms.has(platform);
              return (
                <label
                  key={platform}
                  className={`badge badge-sm gap-1.5 cursor-pointer transition-colors select-none ${
                    active
                      ? "bg-primary/15 border-primary/40 text-primary"
                      : "bg-base-200 border hairline text-base-content/70 hover:border-primary/40"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="checkbox checkbox-xs"
                    checked={active}
                    onChange={() => togglePlatform(platform)}
                    aria-label={`Filter by ${platform}`}
                  />
                  {platform}
                </label>
              );
            })}
          </div>
        )}

        {/* In stock */}
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="font-mono text-xs uppercase tracking-wider text-base-content/50 hidden sm:inline">
            In stock
          </span>
          <input
            type="checkbox"
            className="toggle toggle-primary toggle-sm"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            aria-label="Show only in-stock products"
          />
        </label>

        {/* Price range */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wider text-base-content/50 hidden sm:inline">
            Price
          </span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="input input-sm w-24 font-mono"
            aria-label="Minimum price"
          />
          <span className="text-base-content/30 font-mono text-xs">–</span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="input input-sm w-24 font-mono"
            aria-label="Maximum price"
          />
        </div>

        {/* Clear */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="btn btn-ghost btn-xs font-mono normal-case text-base-content/60 hover:text-primary"
          >
            Clear
          </button>
        )}
      </div>

      {/* Result count */}
      <div className="flex items-center gap-2 mb-6 font-mono text-xs uppercase tracking-wider text-base-content/45">
        <SlidersHorizontal className="size-3.5" />
        {filtered.length} product{filtered.length === 1 ? "" : "s"}
        {hasActiveFilters && (
          <span className="text-primary/70">· filtered</span>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed hairline p-16 text-center text-base-content/60">
          No products match your filters.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
