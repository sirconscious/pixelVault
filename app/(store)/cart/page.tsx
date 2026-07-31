import { getStoreSettings } from "@/lib/settings";
import CartView from "@/components/store/CartView";

export const metadata = {
  title: "Your cart",
  description:
    "Review your selection and send it via WhatsApp for instant delivery.",
  alternates: { canonical: "/cart" },
  openGraph: {
    title: "Your cart — PixelVault",
    description:
      "Review your selection and send it via WhatsApp for instant delivery.",
  },
};

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const settings = await getStoreSettings();

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
      <div className="mb-10">
        <div className="font-mono text-xs uppercase tracking-[0.22em] text-primary/80 mb-5 flex items-center gap-3">
          <span className="inline-block w-6 h-px bg-primary/60" />
          Cart
        </div>
        <h1 className="font-display font-semibold text-3xl lg:text-4xl tracking-tight">
          Your cart
        </h1>
      </div>
      <CartView
        whatsapp={{
          whatsappNumber: settings.whatsappNumber,
          whatsappGreeting: settings.whatsappGreeting,
        }}
      />
    </div>
  );
}
