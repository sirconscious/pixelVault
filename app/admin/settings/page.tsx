import { getStoreSettings } from "@/lib/settings";
import SettingsForm from "./SettingsForm";

export const metadata = { title: "Settings — Admin" };

export default async function SettingsPage() {
  const settings = await getStoreSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Store settings</h1>
        <p className="text-sm opacity-70">
          These control your storefront and the WhatsApp checkout message.
        </p>
      </div>
      <SettingsForm
        initial={{
          storeName: settings.storeName,
          whatsappNumber: settings.whatsappNumber,
          whatsappGreeting: settings.whatsappGreeting,
          currency: settings.currency,
        }}
      />
    </div>
  );
}
