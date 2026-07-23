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

/** Format an amount as Moroccan Dirham, e.g. formatMoney(25) -> "25,00 DH". */
export function formatMoney(amount: number): string {
  try {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} DH`;
  }
}
