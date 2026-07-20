import { cache } from "react";
import { prisma } from "./prisma";

export type PublicStoreSettings = {
  id: string;
  storeName: string;
  whatsappNumber: string;
  whatsappGreeting: string;
  currency: string;
};

const DEFAULTS = {
  storeName: "My Digital Store",
  whatsappNumber: "",
  whatsappGreeting: "Hello! I'd like to order:",
  currency: "USD",
};

/**
 * Fetch the singleton StoreSettings row, creating it with defaults if missing.
 * Wrapped in React `cache` so it is deduped within a single request.
 */
export const getStoreSettings = cache(
  async (): Promise<PublicStoreSettings> => {
    const existing = await prisma.storeSettings.findFirst();
    if (existing) return existing;

    return prisma.storeSettings.create({ data: DEFAULTS });
  },
);
