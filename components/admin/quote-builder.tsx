"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2, Save, Send } from "lucide-react";
import { saveQuote, sendQuote } from "@/lib/admin-actions";
import { formatNaira } from "@/lib/utils";
import type { Booking } from "@/types/db";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const toNum = (v: string) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};
const orNull = (n: number) => (n > 0 ? n : null);
const str = (n: number | null | undefined) => (n != null ? String(n) : "");

const LINES = [
  { key: "cost_food", label: "Food & menu" },
  { key: "cost_transport", label: "Transport & logistics" },
  { key: "cost_decoration", label: "Decoration" },
  { key: "cost_equipment", label: "Equipment & rentals" },
  { key: "cost_staff", label: "Service staff" },
] as const;

export function QuoteBuilder({ booking }: { booking: Booking }) {
  const [vals, setVals] = React.useState<Record<string, string>>({
    cost_food: str(booking.cost_food),
    cost_transport: str(booking.cost_transport),
    cost_decoration: str(booking.cost_decoration),
    cost_equipment: str(booking.cost_equipment),
    cost_staff: str(booking.cost_staff),
    discount: str(booking.discount),
    tax: str(booking.tax),
    deposit_percent: booking.deposit_percent != null ? String(booking.deposit_percent) : "50",
    quote_valid_days: "7",
  });
  const [busy, setBusy] = React.useState<null | "save" | "send">(null);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setVals((v) => ({ ...v, [k]: e.target.value }));

  const subtotal = LINES.reduce((sum, l) => sum + toNum(vals[l.key]), 0);
  const total = Math.max(0, subtotal - toNum(vals.discount) + toNum(vals.tax));
  const depositPct = toNum(vals.deposit_percent);
  const depositAmount = Math.round((total * depositPct) / 100);

  const buildQuote = () => ({
    cost_food: orNull(toNum(vals.cost_food)),
    cost_transport: orNull(toNum(vals.cost_transport)),
    cost_decoration: orNull(toNum(vals.cost_decoration)),
    cost_equipment: orNull(toNum(vals.cost_equipment)),
    cost_staff: orNull(toNum(vals.cost_staff)),
    discount: orNull(toNum(vals.discount)),
    tax: orNull(toNum(vals.tax)),
    total: orNull(total),
    deposit_percent: orNull(depositPct),
    deposit_amount: orNull(depositAmount),
  });

  const onSave = async () => {
    setBusy("save");
    const res = await saveQuote(booking.id, buildQuote());
    setBusy(null);
    if (res.ok) toast.success(res.message);
    else toast.error(res.message);
  };

  const onSend = async () => {
    if (total <= 0) {
      toast.error("Add at least one cost before sending.");
      return;
    }
    if (!window.confirm(`Email this quote (${formatNaira(total)}) to ${booking.contact_email}?`)) return;
    setBusy("send");
    const res = await sendQuote(booking.id, { ...buildQuote(), quote_valid_days: toNum(vals.quote_valid_days) || 7 });
    setBusy(null);
    if (res.ok) toast.success(res.message);
    else toast.error(res.message);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <h2 className="font-display text-lg font-semibold tracking-tight">Quote builder</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter costs in Naira. Totals and deposit update automatically.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {LINES.map((l) => (
          <Field key={l.key} label={l.label}>
            <Input inputMode="decimal" placeholder="0" value={vals[l.key]} onChange={set(l.key)} />
          </Field>
        ))}
        <Field label="Discount">
          <Input inputMode="decimal" placeholder="0" value={vals.discount} onChange={set("discount")} />
        </Field>
        <Field label="Tax">
          <Input inputMode="decimal" placeholder="0" value={vals.tax} onChange={set("tax")} />
        </Field>
        <Field label="Deposit %">
          <Input inputMode="decimal" placeholder="50" value={vals.deposit_percent} onChange={set("deposit_percent")} />
        </Field>
        <Field label="Quote valid (days)">
          <Input inputMode="numeric" placeholder="7" value={vals.quote_valid_days} onChange={set("quote_valid_days")} />
        </Field>
      </div>

      <div className="mt-6 space-y-2 rounded-xl bg-secondary/50 p-4">
        <Row label="Subtotal" value={formatNaira(subtotal)} />
        {toNum(vals.discount) > 0 && <Row label="Discount" value={`− ${formatNaira(toNum(vals.discount))}`} />}
        {toNum(vals.tax) > 0 && <Row label="Tax" value={formatNaira(toNum(vals.tax))} />}
        <div className="border-t border-border pt-2">
          <Row label="Total" value={formatNaira(total)} strong />
        </div>
        <Row label={`Deposit (${depositPct || 0}%)`} value={formatNaira(depositAmount)} accent />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button variant="outline" onClick={onSave} disabled={busy !== null} className="flex-1">
          {busy === "save" ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Save draft
        </Button>
        <Button onClick={onSend} disabled={busy !== null} className="flex-1">
          {busy === "send" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          Send quote to customer
        </Button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function Row({
  label,
  value,
  strong,
  accent,
}: {
  label: string;
  value: string;
  strong?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={accent ? "font-medium text-accent" : "text-muted-foreground"}>{label}</span>
      <span
        className={
          accent
            ? "font-display text-base font-semibold text-accent"
            : strong
              ? "font-display text-base font-semibold"
              : "font-medium"
        }
      >
        {value}
      </span>
    </div>
  );
}
