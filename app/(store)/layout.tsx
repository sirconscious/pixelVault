import { getStoreSettings } from "@/lib/settings";
import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";
import Toaster from "@/components/ui/Toaster";
import IntroLoader from "@/components/ui/IntroLoader";
import ConditionalCursor from "@/components/store/ConditionalCursor";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getStoreSettings();

  return (
    <div className="drawer">
      <ConditionalCursor />
      <input id="mobile-nav" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col min-h-screen">
        <Navbar
          storeName={settings.storeName}
          whatsappNumber={settings.whatsappNumber}
          whatsappGreeting={settings.whatsappGreeting}
        />
        <div className="flex-1">
          <IntroLoader>{children}</IntroLoader>
        </div>
        <Footer
          storeName={settings.storeName}
          whatsappNumber={settings.whatsappNumber}
          whatsappGreeting={settings.whatsappGreeting}
        />
      </div>
      <div className="drawer-side z-50">
        <label htmlFor="mobile-nav" className="drawer-overlay" />
        <div className="bg-base-100 min-h-full w-72 p-6 flex flex-col gap-6">
          <span className="font-display font-semibold text-lg">{settings.storeName}</span>
          <ul className="menu gap-1 text-sm font-mono">
            {[
              { href: "/#how", label: "how it works" },
              { href: "/catalog", label: "catalog" },
              { href: "/#checkout", label: "checkout" },
              { href: "/cart", label: "cart" },
            ].map((l) => (
              <li key={l.href}>
                <a href={l.href} className="link-quiet">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
