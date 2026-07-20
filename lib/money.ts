import type { Prisma } from "@/generated/prisma/client";

/**
 * Convert a Prisma Decimal (or number/string) into a plain number so it can
 * safely cross the server -> client component boundary.
 */
export function toNumber(
  value: Prisma.Decimal | number | string | null | undefined,
): number {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  return Number(value.toString());
}

/** Format an amount as a currency string, e.g. formatMoney(25, "USD") -> "$25.00". */
export function formatMoney(amount: number, currency = "USD"): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    // Fallback for invalid currency codes.
    return `${amount.toFixed(2)} ${currency}`;
  }
}
