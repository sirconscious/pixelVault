import { buildWaLink } from "@/lib/whatsapp";

export default function Footer({
  storeName,
  whatsappNumber,
  whatsappGreeting,
}: {
  storeName: string;
  whatsappNumber: string;
  whatsappGreeting: string;
}) {
  const waLink = whatsappNumber
    ? buildWaLink(whatsappNumber, whatsappGreeting)
    : null;

  return (
    <footer className="border-t hairline py-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-wrap items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-3 text-base-content/60">
          <span className="w-5 h-5 rounded border hairline-strong flex items-center justify-center text-primary">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-3 h-3"
            >
              <rect x="3" y="3" width="18" height="18" rx="2.5" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          </span>
          <span className="font-display font-medium text-base-content/80">
            {storeName}
          </span>
          <span className="text-base-content/35 font-mono text-xs">
            — game credits, handed over by a human.
          </span>
        </div>
        {waLink && (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="link-quiet font-mono text-xs"
          >
            Chat on WhatsApp
          </a>
        )}
      </div>
    </footer>
  );
}
