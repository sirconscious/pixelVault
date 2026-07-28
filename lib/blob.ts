import { del } from "@vercel/blob";

export function isBlobUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.includes("blob.vercel-storage.com");
}

export async function deleteBlobIfExists(url: string | null | undefined): Promise<void> {
  if (!url || !isBlobUrl(url)) return;
  try {
    await del(url);
  } catch {
    // Best-effort cleanup — don't crash if delete fails
  }
}
