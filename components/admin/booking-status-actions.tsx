"use client";

import * as React from "react";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";
import { updateBookingStatus } from "@/lib/admin-actions";
import type { BookingStatus } from "@/types/db";
import { Button } from "@/components/ui/button";

const ALL: BookingStatus[] = [
  "pending",
  "quote_sent",
  "awaiting_deposit",
  "deposit_received",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
];

const LABEL: Record<BookingStatus, string> = {
  pending: "New request",
  quote_sent: "Quote sent",
  awaiting_deposit: "Awaiting deposit",
  deposit_received: "Deposit received",
  confirmed: "Confirmed",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const selectClass =
  "flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30";

export function BookingStatusActions({
  bookingId,
  status,
}: {
  bookingId: string;
  status: BookingStatus;
}) {
  const [busy, setBusy] = React.useState(false);
  const [target, setTarget] = React.useState<BookingStatus>(status);

  const apply = async (s: BookingStatus) => {
    if (s === "confirmed" && !window.confirm("Confirm this booking? The customer will be emailed.")) {
      return;
    }
    setBusy(true);
    const res = await updateBookingStatus(bookingId, s);
    setBusy(false);
    if (res.ok) toast.success(res.message);
    else toast.error(res.message);
  };

  const canConfirm = status === "awaiting_deposit" || status === "deposit_received";

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <h2 className="font-display text-lg font-semibold tracking-tight">Status</h2>
      <p className="mt-1 text-sm text-muted-foreground">Current: {LABEL[status]}</p>

      {canConfirm && (
        <Button onClick={() => apply("confirmed")} disabled={busy} className="mt-4 w-full">
          {busy ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
          Confirm booking
        </Button>
      )}

      <div className="mt-4">
        <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Set status manually
        </label>
        <div className="mt-2 flex gap-2">
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value as BookingStatus)}
            className={selectClass}
          >
            {ALL.map((s) => (
              <option key={s} value={s}>
                {LABEL[s]}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            onClick={() => apply(target)}
            disabled={busy || target === status}
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}
