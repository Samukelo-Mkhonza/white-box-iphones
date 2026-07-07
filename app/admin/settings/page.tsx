import type { Metadata } from "next";
import { getStoreSettings } from "@/lib/settings";
import { StoreSettingsForm } from "@/components/admin/StoreSettingsForm";

export const metadata: Metadata = { title: "Admin · Settings" };

export default async function AdminSettingsPage() {
  const settings = await getStoreSettings();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Store Settings</h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        These values apply store-wide, shown at checkout and on every product page.
      </p>
      <div className="mt-6">
        <StoreSettingsForm
          flatShippingFeeCents={settings.flatShippingFeeCents}
          minDeliveryDays={settings.minDeliveryDays}
          maxDeliveryDays={settings.maxDeliveryDays}
        />
      </div>
    </div>
  );
}
