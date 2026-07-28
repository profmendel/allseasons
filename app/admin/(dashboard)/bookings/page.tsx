import Link from "next/link";
import { ChevronRight, Inbox } from "lucide-react";
import { getAdminBookings } from "@/lib/admin-data";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatDate } from "@/lib/utils";

export default async function AdminBookingsPage() {
  const bookings = await getAdminBookings();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-medium tracking-tight">Bookings</h1>
        <p className="mt-1 text-muted-foreground">
          {bookings.length} {bookings.length === 1 ? "request" : "requests"} in the pipeline.
        </p>
      </header>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card px-6 py-20 text-center shadow-soft">
          <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
            <Inbox className="size-6" />
          </span>
          <p className="font-medium">No bookings yet</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Requests submitted through the website quote form will show up here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <div className="hidden grid-cols-[1.5fr_1.2fr_1fr_0.8fr_auto] gap-4 border-b border-border px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:grid">
            <span>Customer</span>
            <span>Event</span>
            <span>Date</span>
            <span>Status</span>
            <span />
          </div>
          <ul className="divide-y divide-border">
            {bookings.map((b) => (
              <li key={b.id}>
                <Link
                  href={`/admin/bookings/${b.id}`}
                  className="grid grid-cols-1 items-center gap-1.5 px-5 py-4 transition-colors hover:bg-secondary/40 md:grid-cols-[1.5fr_1.2fr_1fr_0.8fr_auto] md:gap-4"
                >
                  <div className="min-w-0">
                    <div className="truncate font-medium">{b.contact_name}</div>
                    <div className="font-mono text-xs text-muted-foreground">{b.reference}</div>
                  </div>
                  <div className="truncate text-sm text-muted-foreground">
                    {b.event_type ?? "—"}
                    {b.guest_count ? ` · ${b.guest_count} guests` : ""}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {b.event_date ? formatDate(b.event_date) : "—"}
                  </div>
                  <div>
                    <StatusBadge status={b.status} />
                  </div>
                  <ChevronRight className="hidden size-4 justify-self-end text-muted-foreground md:block" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
