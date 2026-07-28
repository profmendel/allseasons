"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { saveSettings } from "@/lib/admin-content";
import type { SiteSettings } from "@/types/db";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type FieldDef = { name: keyof SiteSettings; label: string; type?: "textarea" | "number"; help?: string; colSpan?: 2 };

const GROUPS: { title: string; fields: FieldDef[] }[] = [
  {
    title: "Business",
    fields: [
      { name: "business_name", label: "Business name" },
      { name: "tagline", label: "Tagline" },
      { name: "about_short", label: "About (short)", type: "textarea", colSpan: 2 },
      { name: "default_deposit_percent", label: "Default deposit %", type: "number" },
    ],
  },
  {
    title: "Contact",
    fields: [
      { name: "phone", label: "Phone" },
      { name: "whatsapp", label: "WhatsApp number", help: "Digits only, e.g. 2348000000000" },
      { name: "email", label: "Email" },
      { name: "address", label: "Address" },
    ],
  },
  {
    title: "Social links",
    fields: [
      { name: "instagram_url", label: "Instagram URL" },
      { name: "facebook_url", label: "Facebook URL" },
      { name: "tiktok_url", label: "TikTok URL" },
    ],
  },
  {
    title: "Bank details",
    fields: [
      { name: "bank_name", label: "Bank name" },
      { name: "bank_account_name", label: "Account name" },
      { name: "bank_account_number", label: "Account number" },
    ],
  },
];

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [values, setValues] = React.useState<Record<string, string>>(() => {
    const v: Record<string, string> = {};
    for (const g of GROUPS) {
      for (const f of g.fields) {
        const raw = settings[f.name];
        v[f.name] = raw != null ? String(raw) : "";
      }
    }
    return v;
  });
  const [pending, start] = React.useTransition();

  const set = (name: string, value: string) => setValues((v) => ({ ...v, [name]: value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      const res = await saveSettings(values);
      if (res.ok) toast.success(res.message);
      else toast.error(res.message);
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {GROUPS.map((group) => (
        <section key={group.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-display text-lg font-semibold tracking-tight">{group.title}</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            {group.fields.map((f) => (
              <div key={String(f.name)} className={f.colSpan === 2 ? "sm:col-span-2" : ""}>
                <div className="flex flex-col gap-2">
                  <Label>{f.label}</Label>
                  {f.type === "textarea" ? (
                    <Textarea rows={3} value={values[f.name]} onChange={(e) => set(f.name, e.target.value)} />
                  ) : (
                    <Input
                      inputMode={f.type === "number" ? "numeric" : undefined}
                      value={values[f.name]}
                      onChange={(e) => set(f.name, e.target.value)}
                    />
                  )}
                  {f.help && <p className="text-xs text-muted-foreground">{f.help}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="sticky bottom-4 flex justify-end">
        <Button type="submit" size="lg" disabled={pending} className="shadow-lift">
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Save settings
        </Button>
      </div>
    </form>
  );
}
