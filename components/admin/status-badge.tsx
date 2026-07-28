import { cn } from "@/lib/utils";
import type { BookingStatus } from "@/types/db";

const META: Record<BookingStatus, { label: string; cls: string }> = {
  pending: { label: "New request", cls: "bg-amber-500/15 text-amber-700 dark:text-amber-400" },
  quote_sent: { label: "Quote sent", cls: "bg-accent/15 text-accent" },
  awaiting_deposit: { label: "Awaiting deposit", cls: "bg-accent/15 text-accent" },
  deposit_received: { label: "Deposit received", cls: "bg-blue-500/15 text-blue-700 dark:text-blue-400" },
  confirmed: { label: "Confirmed", cls: "bg-primary/12 text-primary" },
  in_progress: { label: "In progress", cls: "bg-primary/12 text-primary" },
  completed: { label: "Completed", cls: "bg-primary/12 text-primary" },
  cancelled: { label: "Cancelled", cls: "bg-destructive/12 text-destructive" },
};

export function StatusBadge({
  status,
  className,
}: {
  status: BookingStatus;
  className?: string;
}) {
  const m = META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium",
        m.cls,
        className,
      )}
    >
      {m.label}
    </span>
  );
}
