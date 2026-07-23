import { formatMoney } from "./money";

export type WhatsAppLineItem = {
  productName: string;
  variantLabel: string;
  unitPrice: number;
  quantity: number;
  currency: string;
};

export type WhatsAppSettings = {
  whatsappNumber: string;
  whatsappGreeting: string;
};

/**
 * Build a human-readable order summary message from cart line items.
 * Pure function — no DOM, no side effects — so it can be unit tested.
 */
export function buildOrderMessage(
  items: WhatsAppLineItem[],
  greeting: string,
): string {
  const currency = items[0]?.currency ?? "MAD";

  const lines = items.map((item, index) => {
    const lineTotal = item.unitPrice * item.quantity;
    const qtyPart = `x${item.quantity}`;
    return `${index + 1}. ${item.productName} — ${item.variantLabel} ${qtyPart} — ${formatMoney(
      lineTotal,
    )}`;
  });

  const total = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  return [
    greeting,
    "",
    ...lines,
    "",
    `Total: ${formatMoney(total)}`,
    "",
    "Please let me know the next steps to complete this order. Thank you!",
  ].join("\n");
}

/** Normalize a WhatsApp number to digits only (strips +, spaces, dashes). */
export function normalizeWhatsAppNumber(raw: string): string {
  return raw.replace(/[^0-9]/g, "");
}

/** Build a wa.me deep link with the URL-encoded message. */
export function buildWaLink(whatsappNumber: string, message: string): string {
  const number = normalizeWhatsAppNumber(whatsappNumber);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/** Convenience: build the full wa.me link straight from line items. */
export function buildOrderLink(
  items: WhatsAppLineItem[],
  settings: WhatsAppSettings,
): string {
  const message = buildOrderMessage(items, settings.whatsappGreeting);
  return buildWaLink(settings.whatsappNumber, message);
}
