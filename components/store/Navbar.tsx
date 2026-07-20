"use client";

import Link from "next/link";
import { ShoppingCart, Menu } from "lucide-react";
import { useCart, selectCount } from "@/stores/cart";
import { useHydrated } from "@/lib/useHydrated";
import { buildWaLink } from "@/lib/whatsapp";
const NAV_LINKS = [
  { href: "/#how", label: "how it works" },
  { href: "/catalog", label: "catalog" },
  { href: "/#checkout", label: "checkout" },
];

function VaultMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      <line x1="12" y1="3" x2="12" y2="5.5" />
      <line x1="12" y1="18.5" x2="12" y2="21" />
      <line x1="3" y1="12" x2="5.5" y2="12" />
      <line x1="18.5" y1="12" x2="21" y2="12" />
    </svg>
  );
}

function WhatsAppGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export default function Navbar({
  storeName,
  whatsappNumber,
  whatsappGreeting,
}: {
  storeName: string;
  whatsappNumber: string;
  whatsappGreeting: string;
}) {
  const hydrated = useHydrated();
  const count = useCart(selectCount);
  const waLink = whatsappNumber
    ? buildWaLink(whatsappNumber, `${whatsappGreeting}`)
    : null;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-base-100/70 border-b hairline">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-md border hairline-strong flex items-center justify-center text-primary">
            <VaultMark className="w-4 h-4" />
          </span>
          <span className="font-display font-semibold tracking-tight text-lg">
            {storeName}
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-mono">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="link-quiet">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="mobile-nav" className="btn btn-ghost btn-sm btn-square md:hidden" aria-label="Open menu">
            <Menu className="size-5" />
          </label>

          <Link
            href="/cart"
            className="btn btn-sm btn-ghost btn-circle relative"
            aria-label="Cart"
          >
            <div className="indicator">
              <ShoppingCart className="size-5" />
              {hydrated && count > 0 && (
                <span className="badge badge-primary badge-xs indicator-item">
                  {count}
                </span>
              )}
            </div>
          </Link>

          {waLink && (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm gap-2 rounded-md border hairline-strong bg-base-200 hover:bg-base-300 hover:border-primary/60 text-base-content normal-case font-medium"
            >
              <WhatsAppGlyph className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline">Chat to order</span>
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
