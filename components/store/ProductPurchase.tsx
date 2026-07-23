"use client";

import { useMemo, useState } from "react";
import { Minus, Plus, ShoppingCart, MessageCircle } from "lucide-react";
import { useCart } from "@/stores/cart";
import { toast } from "@/components/ui/toast";
import { formatMoney } from "@/lib/money";
import { buildOrderLink, type WhatsAppLineItem } from "@/lib/whatsapp";

export type PurchaseVariant = {
  id: string;
  label: string;
  price: number;
  currency: string;
  inStock: boolean;
};

export type PurchaseProduct = {
  name: string;
  slug: string;
  imageUrl: string | null;
  variants: PurchaseVariant[];
};

export default function ProductPurchase({
  product,
  whatsapp,
}: {
  product: PurchaseProduct;
  whatsapp: { whatsappNumber: string; whatsappGreeting: string };
}) {
  const add = useCart((s) => s.add);

  const firstInStock =
    product.variants.find((v) => v.inStock)?.id ?? product.variants[0]?.id ?? "";
  const [selectedId, setSelectedId] = useState(firstInStock);
  const [qty, setQty] = useState(1);

  const selected = useMemo(
    () => product.variants.find((v) => v.id === selectedId),
    [product.variants, selectedId],
  );

  const canBuy = !!selected && selected.inStock;

  const addToCart = () => {
    if (!selected || !selected.inStock) return;
    add(
      {
        variantId: selected.id,
        productName: product.name,
        productSlug: product.slug,
        variantLabel: selected.label,
        unitPrice: selected.price,
        currency: selected.currency,
        imageUrl: product.imageUrl,
      },
      qty,
    );
    toast.success(`Added ${product.name} (${selected.label}) to cart`);
  };

  const buyNow = () => {
    if (!selected || !selected.inStock) return;
    if (!whatsapp.whatsappNumber) {
      toast.error("Store WhatsApp number is not configured yet.");
      return;
    }
    const line: WhatsAppLineItem = {
      productName: product.name,
      variantLabel: selected.label,
      unitPrice: selected.price,
      quantity: qty,
      currency: selected.currency,
    };
    const url = buildOrderLink([line], whatsapp);
    toast.info("Opening WhatsApp with your order…");
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-6">
      {/* Variant picker */}
      <div>
        <span className="mb-2 block text-sm font-semibold">Choose an option</span>
        <div className="flex flex-wrap gap-2">
          {product.variants.map((v) => {
            const active = v.id === selectedId;
            return (
              <button
                key={v.id}
                type="button"
                disabled={!v.inStock}
                onClick={() => setSelectedId(v.id)}
                className={`btn rounded-md ${active ? "btn-primary" : "btn-outline hairline"} ${
                  !v.inStock ? "btn-disabled opacity-50" : ""
                }`}
                aria-pressed={active}
              >
                <span>{v.label}</span>
                <span className="opacity-80">
                  {formatMoney(v.price)}
                </span>
                {!v.inStock && <span className="badge badge-sm">Sold out</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <span className="mb-2 block text-sm font-semibold">Quantity</span>
        <div className="join">
          <button
            type="button"
            className="btn join-item"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
          >
            <Minus className="size-4" />
          </button>
          <input
            className="input input-bordered join-item w-16 text-center"
            type="number"
            min={1}
            value={qty}
            onChange={(e) =>
              setQty(Math.max(1, Number(e.target.value) || 1))
            }
            aria-label="Quantity"
          />
          <button
            type="button"
            className="btn join-item"
            onClick={() => setQty((q) => q + 1)}
            aria-label="Increase quantity"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>

      {/* Price + actions */}
      {selected && (
        <div className="text-2xl font-bold">
          {formatMoney(selected.price * qty)}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          className="btn btn-primary w-full sm:flex-1 rounded-md gap-2"
          onClick={addToCart}
          disabled={!canBuy}
        >
          <ShoppingCart className="size-5" />
          Add to cart
        </button>
        <button
          type="button"
          className="btn btn-success w-full sm:flex-1 rounded-md gap-2"
          onClick={buyNow}
          disabled={!canBuy}
        >
          <MessageCircle className="size-5" />
          Buy on WhatsApp
        </button>
      </div>

      {!canBuy && (
        <p className="text-sm text-error">
          This option is currently sold out. Try another option.
        </p>
      )}
    </div>
  );
}
