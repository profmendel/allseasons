import { createAdminSupabase } from "@/lib/supabase/admin";
import type { Booking } from "@/types/db";

/** A realistic sample quote so the customer portal is viewable at /quote/demo
 *  before Supabase is connected. */
export const DEMO_BOOKING: Booking = {
  id: "demo",
  reference: "ASC-DEMO2026",
  contact_name: "Chioma Okafor",
  contact_email: "chioma@example.com",
  contact_phone: "+234 800 000 0000",
  event_type: "Wedding",
  event_date: "2026-09-12",
  event_time: "14:00",
  location: "Lekki, Lagos",
  guest_count: 250,
  package_id: null,
  special_requests: "Please include vegetarian options for ~20 guests and a live jollof station.",
  menu_item_ids: [],
  extras: [{ name: "Small Chops" }, { name: "Zobo & Chapman" }],
  cost_food: 3000000,
  cost_transport: 150000,
  cost_decoration: 400000,
  cost_equipment: 200000,
  cost_staff: 250000,
  discount: 100000,
  tax: 0,
  total: 3900000,
  deposit_percent: 50,
  deposit_amount: 1950000,
  status: "quote_sent",
  quote_sent_at: new Date().toISOString(),
  quote_expires_at: new Date(Date.now() + 7 * 864e5).toISOString(),
  accepted_at: null,
  confirmed_at: null,
  created_at: new Date(Date.now() - 2 * 864e5).toISOString(),
  updated_at: new Date().toISOString(),
};

/** Load a booking by its (unguessable) uuid. Uses the service role, so this
 *  must only be called from the server. Returns the demo sample for "demo". */
export async function getBookingById(id: string): Promise<Booking | null> {
  if (id === "demo") return DEMO_BOOKING;

  const supabase = createAdminSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return data as Booking;
}
