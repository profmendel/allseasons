"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  MapPin,
  PartyPopper,
  Upload,
  Users,
  XCircle,
} from "lucide-react";
import { acceptQuote, declineQuote, uploadPaymentReceipt } from "@/lib/actions";
import type { Booking, BookingStatus, SiteSettings } from "@/types/db";
import { cn, formatDate, formatNaira } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const STATUS_META: Record<BookingStatus, { label: string; tone: string }> = {
  pending: { label: "Preparing quote", tone: "bg-muted text-muted-foreground" },
  quote_sent: { label: "Quote sent", tone: "bg-accent/15 text-accent" },
  awaiting_deposit: { label: "Awaiting deposit", tone: "bg-accent/15 text-accent" },
  deposit_received: { label: "Payment under review", tone: "bg-primary/10 text-primary" },
  confirmed: { label: "Confirmed", tone: "bg-primary/10 text-primary" },
  in_progress: { label: "In progress", tone: "bg-primary/10 text-primary" },
  completed: { label: "Completed", tone: "bg-primary/10 text-primary" },
  cancelled: { label: "Cancelled", tone: "bg-destructive/10 text-destructive" },
};

const STATUS_ORDER: Record<BookingStatus, number> = {
  pending: 0,
  quote_sent: 1,
  awaiting_deposit: 2,
  deposit_received: 3,
  confirmed: 4,
  in_progress: 4,
  completed: 4,
  cancelled: -1,
};

const TIMELINE = [
  { label: "Quote sent", order: 1 },
  { label: "Accepted", order: 2 },
  { label: "Deposit received", order: 3 },
  { label: "Confirmed", order: 4 },
];

export function QuotePortal({
  booking: initial,
  settings,
  packageName,
  isDemo = false,
}: {
  booking: Booking;
  settings: SiteSettings;
  packageName?: string;
  isDemo?: boolean;
}) {
  const [status, setStatus] = React.useState<BookingStatus>(initial.status);
  const [pending, startTransition] = React.useTransition();
  const [file, setFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);

  const booking = { ...initial, status };
  const meta = STATUS_META[status];
  const currentOrder = STATUS_ORDER[status];
  const depositAmount =
    booking.deposit_amount ??
    (booking.total != null && booking.deposit_percent != null
      ? Math.round((booking.total * booking.deposit_percent) / 100)
      : null);

  const handleAccept = () =>
    startTransition(async () => {
      const res = await acceptQuote(booking.id);
      if (res.ok) {
        setStatus("awaiting_deposit");
        toast.success(res.message);
      } else toast.error(res.message);
    });

  const handleDecline = () =>
    startTransition(async () => {
      const res = await declineQuote(booking.id);
      if (res.ok) {
        setStatus("cancelled");
        toast.success(res.message);
      } else toast.error(res.message);
    });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please choose a receipt file to upload.");
      return;
    }
    setUploading(true);
    const fd = new FormData();
    fd.append("bookingId", booking.id);
    fd.append("receipt", file);
    const res = await uploadPaymentReceipt(fd);
    setUploading(false);
    if (res.ok) {
      setStatus("deposit_received");
      toast.success(res.message);
    } else toast.error(res.message);
  };

  return (
    <div className="mx-auto max-w-3xl">
      {isDemo && (
        <div className="mb-6 rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
          <strong>Sample quote.</strong> This is a live preview of the customer portal. Connect
          Supabase to power real bookings.
        </div>
      )}

      {/* Header */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Quotation
            </p>
            <h1 className="mt-1 font-display text-2xl font-medium tracking-tight md:text-3xl">
              {booking.event_type ?? "Your event"}
            </h1>
            <p className="mt-1 font-mono text-sm text-muted-foreground">{booking.reference}</p>
          </div>
          <span className={cn("rounded-full px-3 py-1.5 text-sm font-medium", meta.tone)}>
            {meta.label}
          </span>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6 sm:grid-cols-4">
          <Meta icon={CalendarDays} label="Date" value={booking.event_date ? formatDate(booking.event_date) : "TBC"} />
          <Meta icon={Clock} label="Time" value={booking.event_time || "TBC"} />
          <Meta icon={Users} label="Guests" value={booking.guest_count ? booking.guest_count.toLocaleString() : "TBC"} />
          <Meta icon={MapPin} label="Location" value={booking.location || "TBC"} />
        </dl>
      </div>

      {/* Timeline */}
      {status !== "cancelled" && (
        <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
          <ol className="flex items-center">
            {TIMELINE.map((stage, i) => {
              const done = currentOrder >= stage.order;
              const isLast = i === TIMELINE.length - 1;
              return (
                <li key={stage.label} className={cn("flex items-center", !isLast && "flex-1")}>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <span
                      className={cn(
                        "grid size-9 place-items-center rounded-full border-2 transition-colors",
                        done
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-muted-foreground",
                      )}
                    >
                      {done ? <Check className="size-4" /> : <span className="size-2 rounded-full bg-current" />}
                    </span>
                    <span className={cn("text-[0.7rem] font-medium sm:text-xs", done ? "text-foreground" : "text-muted-foreground")}>
                      {stage.label}
                    </span>
                  </div>
                  {!isLast && (
                    <span
                      className={cn(
                        "mx-1 mb-6 h-0.5 flex-1 rounded-full transition-colors sm:mx-2",
                        currentOrder > stage.order ? "bg-primary" : "bg-border",
                      )}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {/* Body by status */}
      <div className="mt-6">
        {status === "pending" && (
          <Panel icon={Clock} title="Your quote is being prepared">
            <p>
              Thank you for your request. Our team is putting together a detailed, tailored
              quotation for your event — you&apos;ll receive it by email very soon.
            </p>
          </Panel>
        )}

        {(status === "quote_sent") && (
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
            <h2 className="font-display text-xl font-medium tracking-tight">Your quotation</h2>
            <QuoteBreakdown booking={booking} packageName={packageName} depositAmount={depositAmount} />
            {booking.quote_expires_at && (
              <p className="mt-4 text-sm text-muted-foreground">
                This quote is valid until <strong>{formatDate(booking.quote_expires_at)}</strong>.
              </p>
            )}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={handleAccept} disabled={pending} className="flex-1">
                {pending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                Accept quote
              </Button>
              <Button size="lg" variant="outline" onClick={handleDecline} disabled={pending}>
                <XCircle className="size-4" /> Decline
              </Button>
            </div>
          </div>
        )}

        {status === "awaiting_deposit" && (
          <div className="flex flex-col gap-6">
            <Panel icon={CheckCircle2} title="Quote accepted — one step to go" tone="primary">
              <p>
                To secure your date, please pay the deposit below and upload your payment receipt.
                We&apos;ll confirm your booking as soon as it&apos;s verified.
              </p>
            </Panel>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Building2 className="size-4 text-accent" /> Bank transfer details
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <BankRow label="Deposit amount" value={depositAmount != null ? formatNaira(depositAmount) : "—"} highlight />
                <BankRow label="Bank" value={settings.bank_name ?? "—"} />
                <BankRow label="Account name" value={settings.bank_account_name ?? "—"} />
                <BankRow label="Account number" value={settings.bank_account_number ?? "—"} />
              </div>
              <p className="mt-4 rounded-xl bg-secondary/60 p-3 text-sm text-muted-foreground">
                Please use your reference <strong className="text-foreground">{booking.reference}</strong> as
                the payment narration.
              </p>
            </div>

            <form onSubmit={handleUpload} className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Upload className="size-4 text-accent" /> Upload payment receipt
              </div>
              <label className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-input bg-background px-4 py-8 text-center transition-colors hover:border-ring">
                <FileText className="size-6 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {file ? file.name : "Click to choose a file"}
                </span>
                <span className="text-xs text-muted-foreground">PNG, JPG or PDF · max 8MB</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </label>
              <Button type="submit" size="lg" className="mt-5 w-full" disabled={uploading}>
                {uploading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Uploading…
                  </>
                ) : (
                  <>
                    Submit payment receipt <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </form>
          </div>
        )}

        {status === "deposit_received" && (
          <Panel icon={Clock} title="Payment received — under review" tone="primary">
            <p>
              Thank you! We&apos;ve received your payment receipt and our team is verifying it. You&apos;ll
              get a confirmation email once your booking is secured. This usually takes a few hours.
            </p>
          </Panel>
        )}

        {(status === "confirmed" || status === "in_progress" || status === "completed") && (
          <Panel icon={PartyPopper} title="Your booking is confirmed!" tone="primary">
            <p>
              Everything is set for your {booking.event_type ?? "event"}. Our team will be in touch
              closer to the date to finalise the details. We can&apos;t wait to cater for you!
            </p>
          </Panel>
        )}

        {status === "cancelled" && (
          <Panel icon={XCircle} title="This quote was declined" tone="destructive">
            <p>
              This quotation is no longer active. If this was a mistake or your plans have changed,
              please <Link href="/contact" className="font-medium text-primary underline">get in touch</Link> —
              we&apos;d love to help.
            </p>
          </Panel>
        )}
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Questions about your quote?{" "}
        <Link href="/contact" className="font-medium text-primary underline underline-offset-2">
          Contact us
        </Link>
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------- helpers */

function Meta({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Icon className="size-3.5 text-accent" /> {label}
      </dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  );
}

function Panel({
  icon: Icon,
  title,
  tone = "muted",
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  tone?: "muted" | "primary" | "destructive";
  children: React.ReactNode;
}) {
  const toneClass =
    tone === "primary"
      ? "bg-primary/10 text-primary"
      : tone === "destructive"
        ? "bg-destructive/10 text-destructive"
        : "bg-muted text-muted-foreground";
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
      <span className={cn("grid size-12 place-items-center rounded-xl", toneClass)}>
        <Icon className="size-6" />
      </span>
      <h2 className="mt-4 font-display text-xl font-medium tracking-tight">{title}</h2>
      <div className="mt-2 leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

function QuoteBreakdown({
  booking,
  packageName,
  depositAmount,
}: {
  booking: Booking;
  packageName?: string;
  depositAmount: number | null;
}) {
  const lines: { label: string; value: number | null }[] = [
    { label: "Food & menu", value: booking.cost_food },
    { label: "Transport & logistics", value: booking.cost_transport },
    { label: "Decoration", value: booking.cost_decoration },
    { label: "Equipment & rentals", value: booking.cost_equipment },
    { label: "Service staff", value: booking.cost_staff },
  ].filter((l) => l.value != null && l.value > 0);

  return (
    <div className="mt-5">
      {packageName && (
        <div className="mb-4">
          <Badge variant="gold">{packageName}</Badge>
        </div>
      )}
      <table className="w-full text-sm">
        <tbody>
          {lines.map((line) => (
            <tr key={line.label} className="border-b border-border">
              <td className="py-2.5 text-muted-foreground">{line.label}</td>
              <td className="py-2.5 text-right font-medium">{formatNaira(line.value)}</td>
            </tr>
          ))}
          {booking.discount != null && booking.discount > 0 && (
            <tr className="border-b border-border">
              <td className="py-2.5 text-muted-foreground">Discount</td>
              <td className="py-2.5 text-right font-medium text-primary">
                − {formatNaira(booking.discount)}
              </td>
            </tr>
          )}
          {booking.tax != null && booking.tax > 0 && (
            <tr className="border-b border-border">
              <td className="py-2.5 text-muted-foreground">Tax</td>
              <td className="py-2.5 text-right font-medium">{formatNaira(booking.tax)}</td>
            </tr>
          )}
          {booking.total != null && (
            <tr className="border-b-2 border-foreground/20">
              <td className="py-3 font-display text-base font-semibold">Total</td>
              <td className="py-3 text-right font-display text-lg font-semibold">
                {formatNaira(booking.total)}
              </td>
            </tr>
          )}
          {depositAmount != null && (
            <tr>
              <td className="py-3 font-medium text-accent">
                Deposit to confirm{booking.deposit_percent ? ` (${booking.deposit_percent}%)` : ""}
              </td>
              <td className="py-3 text-right font-display text-lg font-semibold text-accent">
                {formatNaira(depositAmount)}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function BankRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={cn("rounded-xl border border-border p-4", highlight && "border-accent/40 bg-accent/8")}>
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={cn("mt-1 font-medium", highlight && "font-display text-lg text-accent")}>{value}</div>
    </div>
  );
}
