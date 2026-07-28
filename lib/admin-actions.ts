"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { getAdminUser, isAllowedAdmin } from "@/lib/auth";
import { sendBookingConfirmedEmail, sendQuoteReadyEmail } from "@/lib/email";
import type { Booking, BookingStatus } from "@/types/db";

/* ----------------------------------------------------------------- auth ---- */

export async function signInAdmin(
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string } | null> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  if (!email || !password) return { error: "Enter your email and password." };
  if (!isAllowedAdmin(email)) {
    return { error: "This account isn't authorised for the dashboard." };
  }

  const supabase = await createServerSupabase();
  if (!supabase) return { error: "Authentication isn't configured yet." };

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Incorrect email or password." };

  redirect("/admin");
}

export async function signOutAdmin() {
  const supabase = await createServerSupabase();
  if (supabase) await supabase.auth.signOut();
  redirect("/admin/login");
}

/* -------------------------------------------------------------- bookings --- */

async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) throw new Error("Not authorised");
  return user;
}

/** Save the priced quote for a booking (draft — does not email yet). */
export async function saveQuote(
  bookingId: string,
  quote: {
    cost_food: number | null;
    cost_transport: number | null;
    cost_decoration: number | null;
    cost_equipment: number | null;
    cost_staff: number | null;
    discount: number | null;
    tax: number | null;
    total: number | null;
    deposit_percent: number | null;
    deposit_amount: number | null;
  },
): Promise<{ ok: boolean; message: string }> {
  await requireAdmin();
  const supabase = createAdminSupabase();
  if (!supabase) return { ok: false, message: "Supabase not configured." };

  const { error } = await supabase.from("bookings").update(quote).eq("id", bookingId);
  if (error) return { ok: false, message: error.message };

  revalidatePath(`/admin/bookings/${bookingId}`);
  return { ok: true, message: "Quote saved." };
}

/** Save the quote (if provided) and email it to the customer. */
export async function sendQuote(
  bookingId: string,
  quote: Parameters<typeof saveQuote>[1] & { quote_valid_days?: number },
): Promise<{ ok: boolean; message: string }> {
  await requireAdmin();
  const supabase = createAdminSupabase();
  if (!supabase) return { ok: false, message: "Supabase not configured." };

  const validDays = quote.quote_valid_days ?? 7;
  const now = new Date();
  const expires = new Date(now.getTime() + validDays * 864e5);

  const { data: updated, error } = await supabase
    .from("bookings")
    .update({
      cost_food: quote.cost_food,
      cost_transport: quote.cost_transport,
      cost_decoration: quote.cost_decoration,
      cost_equipment: quote.cost_equipment,
      cost_staff: quote.cost_staff,
      discount: quote.discount,
      tax: quote.tax,
      total: quote.total,
      deposit_percent: quote.deposit_percent,
      deposit_amount: quote.deposit_amount,
      status: "quote_sent",
      quote_sent_at: now.toISOString(),
      quote_expires_at: expires.toISOString(),
    })
    .eq("id", bookingId)
    .select("*")
    .single();

  if (error || !updated) return { ok: false, message: error?.message ?? "Update failed." };

  try {
    await sendQuoteReadyEmail(updated as Booking);
  } catch (err) {
    console.error("[sendQuote] email failed:", err);
    revalidatePath(`/admin/bookings/${bookingId}`);
    return { ok: true, message: "Quote saved, but the email failed to send." };
  }

  revalidatePath(`/admin/bookings/${bookingId}`);
  return { ok: true, message: "Quote sent to the customer." };
}

/** Manually move a booking to a new status (e.g. verify deposit → confirmed). */
export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
): Promise<{ ok: boolean; message: string }> {
  await requireAdmin();
  const supabase = createAdminSupabase();
  if (!supabase) return { ok: false, message: "Supabase not configured." };

  const patch: Record<string, unknown> = { status };
  if (status === "confirmed") patch.confirmed_at = new Date().toISOString();

  const { data: updated, error } = await supabase
    .from("bookings")
    .update(patch)
    .eq("id", bookingId)
    .select("*")
    .single();

  if (error || !updated) return { ok: false, message: error?.message ?? "Update failed." };

  if (status === "confirmed") {
    try {
      await sendBookingConfirmedEmail(updated as Booking);
    } catch (err) {
      console.error("[updateBookingStatus] confirm email failed:", err);
    }
  }

  revalidatePath(`/admin/bookings/${bookingId}`);
  revalidatePath("/admin/bookings");
  return { ok: true, message: `Booking marked as ${status.replace(/_/g, " ")}.` };
}
