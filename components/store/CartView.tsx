"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Minus,
  Plus,
  Trash2,
  MessageCircle,
  ShoppingCart,
  ImageOff,
  CheckCircle2,
} from "lucide-react";
import { useCart, selectTotal } from "@/stores/cart";
import { useHydrated } from "@/lib/useHydrated";
import { toast } from "@/components/ui/toast";
import { formatMoney } from "@/lib/money";
import { buildOrderLink, type WhatsAppLineItem } from "@/lib/whatsapp";

export default function CartView({
  whatsapp,
}: {
  whatsapp: { whatsappNumber: string; whatsappGreeting: string };
}) {
  const hydrated = useHydrated();
  const items = useCart((s) => s.items);
  const total = useCart(selectTotal);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const [sent, setSent] = useState(false);

  if (!hydrated) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton h-24 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed hairline p-16 text-center">
        <ShoppingCart className="size-10 opacity-40" />
        <p className="font-display text-lg font-semibold">Your cart is empty</p>
        <p className="text-base-content/60">Browse the store and add some codes.</p>
        <Link href="/" className="btn btn-primary rounded-md">
          Continue shopping
        </Link>
      </div>
    );
  }

  const currency = items[0]?.currency ?? "MAD";

  const checkout = () => {
    if (!whatsapp.whatsappNumber) {
      toast.error("Store WhatsApp number is not configured yet.");
      return;
    }
    const lines: WhatsAppLineItem[] = items.map((i) => ({
      productName: i.productName,
      variantLabel: i.variantLabel,
      unitPrice: i.unitPrice,
      quantity: i.quantity,
      currency: i.currency,
    }));
    const url = buildOrderLink(lines, whatsapp);
    toast.info("Opening WhatsApp with your order details…");
    window.open(url, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Line items */}
      <div className="space-y-3 lg:col-span-2">
        {items.map((item) => (
          <div
            key={item.variantId}
            className="flex gap-4 rounded-2xl border hairline bg-base-100 p-4"
          >
            <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-base-300 border hairline">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.productName}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : (
                <span className="flex size-full items-center justify-center">
                  <ImageOff className="size-5 opacity-40" />
                </span>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-1">
              <Link
                href={`/product/${item.productSlug}`}
                className="font-display font-semibold hover:text-primary transition-colors"
              >
                {item.productName}
              </Link>
              <span className="font-mono text-sm text-base-content/60">{item.variantLabel}</span>
              <span className="font-mono text-sm text-primary">
                {formatMoney(item.unitPrice)} each
              </span>
            </div>

            <div className="flex flex-col items-end justify-between">
              <button
                type="button"
                className="btn btn-ghost btn-xs text-error"
                onClick={() => remove(item.variantId)}
                aria-label={`Remove ${item.productName}`}
              >
                <Trash2 className="size-4" />
              </button>

              <div className="join">
                <button
                  type="button"
                  className="btn btn-xs join-item"
                  onClick={() =>
                    setQuantity(item.variantId, item.quantity - 1)
                  }
                  aria-label="Decrease quantity"
                >
                  <Minus className="size-3" />
                </button>
                <span className="btn btn-xs join-item pointer-events-none no-animation">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  className="btn btn-xs join-item"
                  onClick={() =>
                    setQuantity(item.variantId, item.quantity + 1)
                  }
                  aria-label="Increase quantity"
                >
                  <Plus className="size-3" />
                </button>
              </div>

              <span className="font-mono text-sm font-semibold">
                {formatMoney(item.unitPrice * item.quantity)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="h-fit space-y-4 rounded-2xl border hairline bg-base-100 p-6 lg:sticky lg:top-20">
        <h2 className="font-display text-lg font-bold">Order summary</h2>
        <div className="flex justify-between border-t hairline pt-3 text-lg font-bold">
          <span>Total</span>
          <span>{formatMoney(total)}</span>
        </div>

        <button
          type="button"
          className="btn btn-success w-full rounded-md gap-2.5"
          onClick={checkout}
        >
          <MessageCircle className="size-5" />
          Checkout via WhatsApp
        </button>

        <p className="font-mono text-xs text-base-content/50">
          This opens WhatsApp with your order details. We&apos;ll confirm
          payment and delivery there — your cart is kept until you confirm.
        </p>

        {sent && (
          <button
            type="button"
            className="btn btn-outline btn-sm w-full rounded-md"
            onClick={() => {
              clear();
              setSent(false);
              toast.success("Cart cleared. Thanks for your order!");
            }}
          >
            <CheckCircle2 className="size-4" />
            I&apos;ve sent my order — clear cart
          </button>
        )}

        <Link href="/" className="btn btn-ghost btn-sm w-full rounded-md">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
