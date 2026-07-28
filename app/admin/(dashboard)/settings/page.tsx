import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/queries";
import { SettingsForm } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false } };

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="font-display text-3xl font-medium tracking-tight">Website settings</h1>
        <p className="mt-1 text-muted-foreground">
          Business details, contact info, social links and bank details used across the site.
        </p>
      </header>
      <SettingsForm settings={settings} />
    </div>
  );
}
