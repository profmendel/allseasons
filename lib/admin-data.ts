import { createAdminSupabase } from "@/lib/supabase/admin";
import type { Booking, BookingStatus, Payment } from "@/types/db";

export async function getAdminBookings(): Promise<Booking[]> {
  const supabase = createAdminSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as Booking[]) ?? [];
}

export async function getAdminBooking(
  id: string,
): Promise<{ booking: Booking; payments: Payment[] } | null> {
  const supabase = createAdminSupabase();
  if (!supabase) return null;

  const { data: booking } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!booking) return null;

  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("booking_id", id)
    .order("created_at", { ascending: false });

  return { booking: booking as Booking, payments: (payments as Payment[]) ?? [] };
}

export type BookingCounts = Record<BookingStatus | "total", number>;

export function tallyBookings(bookings: Booking[]): BookingCounts {
  const counts = {
    total: bookings.length,
    pending: 0,
    quote_sent: 0,
    awaiting_deposit: 0,
    deposit_received: 0,
    confirmed: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0,
  } as BookingCounts;
  for (const b of bookings) counts[b.status] += 1;
  return counts;
}
