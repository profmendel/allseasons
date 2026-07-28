import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  Receipt,
  Users,
} from "lucide-react";
import { getAdminBooking } from "@/lib/admin-data";
import { getMenu, getPackages } from "@/lib/queries";
import { StatusBadge } from "@/components/admin/status-badge";
import { QuoteBuilder } from "@/components/admin/quote-builder";
import { BookingStatusActions } from "@/components/admin/booking-status-actions";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatNaira } from "@/lib/utils";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getAdminBooking(id);
  if (!data) notFound();
  const { booking, payments } = data;

  const [menu, packages] = await Promise.all([getMenu(), getPackages()]);
  const nameById = new Map(menu.flatMap((c) => c.items).map((i) => [i.id, i.name]));
  const selectedItems = booking.menu_item_ids
    .map((mid) => nameById.get(mid))
    .filter((n): n is string => Boolean(n));
  const pkg = booking.package_id ? packages.find((p) => p.id === booking.package_id) : null;

  return (
    <div className="space-y-6">
      <Link
        href="/admin/bookings"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> All bookings
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-medium tracking-tight">{booking.contact_name}</h1>
            <StatusBadge status={booking.status} />
          </div>
          <p className="mt-1 font-mono text-sm text-muted-foreground">{booking.reference}</p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
            <a href={`mailto:${booking.contact_email}`} className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
              <Mail className="size-4 text-accent" /> {booking.contact_email}
            </a>
            {booking.contact_phone && (
              <a href={`tel:${booking.contact_phone}`} className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
                <Phone className="size-4 text-accent" /> {booking.contact_phone}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Left column */}
        <div className="space-y-6">
          {/* Event details */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-display text-lg font-semibold tracking-tight">Event details</h2>
            <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Meta icon={CalendarDays} label="Date" value={booking.event_date ? formatDate(booking.event_date) : "—"} />
              <Meta icon={Clock} label="Time" value={booking.event_time || "—"} />
              <Meta icon={Users} label="Guests" value={booking.guest_count ? String(booking.guest_count) : "—"} />
              <Meta icon={MapPin} label="Location" value={booking.location || "—"} />
            </dl>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-muted-foreground">Event type:</span>
              <span className="font-medium">{booking.event_type ?? "—"}</span>
              {pkg && (
                <>
                  <span className="text-muted-foreground">· Package:</span>
                  <Badge variant="gold">{pkg.name}</Badge>
                </>
              )}
            </div>
          </section>

          {/* Selections */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-display text-lg font-semibold tracking-tight">Menu &amp; requests</h2>
            <div className="mt-4 space-y-4">
              <Chips label="Menu selections" items={selectedItems} empty="No specific dishes selected." />
              <Chips label="Extras" items={booking.extras.map((e) => e.name)} empty="No extras." />
              {booking.special_requests && (
                <div>
                  <div className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Special requests
                  </div>
                  <p className="rounded-xl bg-secondary/60 p-3 text-sm leading-relaxed">
                    {booking.special_requests}
                  </p>
                </div>
              )}
            </div>
          </section>

          <QuoteBuilder booking={booking} />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <BookingStatusActions bookingId={booking.id} status={booking.status} />

          {/* Payments */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-display text-lg font-semibold tracking-tight">Payments</h2>
            {payments.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No payments submitted yet.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {payments.map((p) => (
                  <li key={p.id} className="rounded-xl border border-border p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-lg font-semibold">{formatNaira(p.amount)}</span>
                      <Badge variant={p.status === "verified" ? "default" : "muted"}>{p.status}</Badge>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">{formatDate(p.created_at)}</div>
                    {p.receipt_url && (
                      <a
                        href={p.receipt_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                      >
                        <Receipt className="size-4" /> View receipt <ExternalLink className="size-3.5" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <Link
            href={`/quote/${booking.id}`}
            target="_blank"
            className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card p-4 text-sm font-medium text-muted-foreground shadow-soft transition-colors hover:text-foreground"
          >
            View customer portal <ExternalLink className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

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

function Chips({ label, items, empty }: { label: string; items: string[]; empty: string }) {
  return (
    <div>
      <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      {items.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {items.map((i, idx) => (
            <Badge key={`${i}-${idx}`} variant="muted">
              {i}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{empty}</p>
      )}
    </div>
  );
}
