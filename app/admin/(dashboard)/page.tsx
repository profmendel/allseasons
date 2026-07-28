import Link from "next/link";
import { ArrowRight, Inbox } from "lucide-react";
import { getAdminBookings, tallyBookings } from "@/lib/admin-data";
import { StatusBadge } from "@/components/admin/status-badge";
import { cn, formatDate } from "@/lib/utils";

export default async function AdminOverviewPage() {
  const bookings = await getAdminBookings();
  const counts = tallyBookings(bookings);
  const recent = bookings.slice(0, 8);

  const cards = [
    { label: "New requests", value: counts.pending, hint: "need a quote", highlight: counts.pending > 0 },
    { label: "Awaiting deposit", value: counts.awaiting_deposit, hint: "quote accepted" },
    { label: "Deposit to verify", value: counts.deposit_received, hint: "needs review", highlight: counts.deposit_received > 0 },
    { label: "Confirmed", value: counts.confirmed, hint: "secured events" },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-medium tracking-tight">Overview</h1>
        <p className="mt-1 text-muted-foreground">
          {counts.total} total {counts.total === 1 ? "booking" : "bookings"} · here&apos;s what needs your attention.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className={cn(
              "rounded-2xl border bg-card p-5 shadow-soft",
              c.highlight ? "border-accent/50 ring-1 ring-accent/30" : "border-border",
            )}
          >
            <div className="text-sm text-muted-foreground">{c.label}</div>
            <div className="mt-2 font-display text-4xl font-semibold tracking-tight">{c.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{c.hint}</div>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-border bg-card shadow-soft">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-lg font-semibold tracking-tight">Recent bookings</h2>
          <Link href="/admin/bookings" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
            View all <ArrowRight className="size-4" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
              <Inbox className="size-6" />
            </span>
            <p className="font-medium">No bookings yet</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              When customers submit the quote form, their requests will appear here.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {recent.map((b) => (
              <li key={b.id}>
                <Link
                  href={`/admin/bookings/${b.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-secondary/40"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium">{b.contact_name}</span>
                      <span className="font-mono text-xs text-muted-foreground">{b.reference}</span>
                    </div>
                    <div className="mt-0.5 truncate text-sm text-muted-foreground">
                      {b.event_type ?? "Event"}
                      {b.event_date ? ` · ${formatDate(b.event_date)}` : ""}
                      {b.guest_count ? ` · ${b.guest_count} guests` : ""}
                    </div>
                  </div>
                  <StatusBadge status={b.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
