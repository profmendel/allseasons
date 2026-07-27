"use server";

import { Resend } from "resend";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { notifyNewReceipt } from "@/lib/email";
import type { Booking } from "@/types/db";
import {
  bookingSchema,
  contactSchema,
  type ActionResult,
  type BookingPayload,
  type ContactFormValues,
} from "@/lib/validators";

/**
 * Submit a booking / quote request from the guided wizard. Persists to Supabase
 * when configured; otherwise accepts gracefully so the flow works in
 * preview/dev before services are wired.
 */
export async function submitBooking(raw: BookingPayload): Promise<ActionResult> {
  const parsed = bookingSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: "Please review the form and try again." };
  }
  const data = parsed.data;
  const guestCount = data.guest_count ? Number(data.guest_count) : null;

  const supabase = createAdminSupabase();
  if (!supabase) {
    console.info("[booking] Supabase not configured — request received:", {
      ...data,
      guestCount,
    });
    return {
      ok: true,
      message: "Thank you! Your quote request has been received. We'll be in touch shortly.",
    };
  }

  let packageId: string | null = null;
  if (data.package_slug) {
    const { data: pkg } = await supabase
      .from("packages")
      .select("id")
      .eq("slug", data.package_slug)
      .maybeSingle();
    packageId = pkg?.id ?? null;
  }

  const { data: inserted, error } = await supabase
    .from("bookings")
    .insert({
      contact_name: data.contact_name,
      contact_email: data.contact_email,
      contact_phone: data.contact_phone || null,
      event_type: data.event_type || null,
      event_date: data.event_date || null,
      event_time: data.event_time || null,
      guest_count: guestCount,
      location: data.location || null,
      package_id: packageId,
      menu_item_ids: data.menu_item_ids,
      extras: data.extras,
      special_requests: data.special_requests || null,
      status: "pending",
    })
    .select("reference")
    .single();

  if (error) {
    console.error("[booking] insert failed:", error.message);
    return {
      ok: false,
      message: "Sorry, something went wrong saving your request. Please try again or contact us directly.",
    };
  }

  return {
    ok: true,
    message: "Thank you! Your quote request has been received. We'll prepare your quotation shortly.",
    reference: inserted?.reference ?? undefined,
  };
}

/**
 * Submit a contact-form message. Emails the business via Resend when
 * configured; otherwise logs and accepts.
 */
export async function submitContact(raw: ContactFormValues): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: "Please review the form and try again." };
  }
  const data = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL || process.env.RESEND_FROM_EMAIL;

  if (apiKey && from && to) {
    try {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from,
        to,
        replyTo: data.email,
        subject: `New enquiry${data.subject ? `: ${data.subject}` : ""} — ${data.name}`,
        text: [
          `Name: ${data.name}`,
          `Email: ${data.email}`,
          data.phone ? `Phone: ${data.phone}` : null,
          data.subject ? `Subject: ${data.subject}` : null,
          "",
          data.message,
        ]
          .filter(Boolean)
          .join("\n"),
      });
    } catch (err) {
      console.error("[contact] email failed:", err);
      return {
        ok: false,
        message: "Sorry, your message couldn't be sent. Please email or call us directly.",
      };
    }
  } else {
    console.info("[contact] Resend not configured — message received:", data);
  }

  return {
    ok: true,
    message: "Thanks for reaching out! We'll get back to you very soon.",
  };
}

/* -------------------------------------------------------------------------- */
/*  Customer portal actions                                                   */
/* -------------------------------------------------------------------------- */

/** Customer accepts their quote → moves to awaiting deposit. */
export async function acceptQuote(id: string): Promise<ActionResult> {
  if (!id) return { ok: false, message: "Missing booking reference." };
  if (id === "demo") {
    return { ok: true, message: "Quote accepted! Please complete your deposit to confirm." };
  }

  const supabase = createAdminSupabase();
  if (!supabase) {
    return { ok: true, message: "Quote accepted! Please complete your deposit to confirm." };
  }

  const { error } = await supabase
    .from("bookings")
    .update({ status: "awaiting_deposit", accepted_at: new Date().toISOString() })
    .eq("id", id)
    .eq("status", "quote_sent");

  if (error) {
    console.error("[acceptQuote] failed:", error.message);
    return { ok: false, message: "Sorry, we couldn't update your quote. Please try again." };
  }
  return { ok: true, message: "Quote accepted! Please complete your deposit to confirm." };
}

/** Customer declines their quote. */
export async function declineQuote(id: string): Promise<ActionResult> {
  if (!id) return { ok: false, message: "Missing booking reference." };
  if (id === "demo") {
    return { ok: true, message: "Your quote has been declined." };
  }

  const supabase = createAdminSupabase();
  if (!supabase) {
    return { ok: true, message: "Your quote has been declined." };
  }

  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", id)
    .in("status", ["quote_sent", "awaiting_deposit"]);

  if (error) {
    console.error("[declineQuote] failed:", error.message);
    return { ok: false, message: "Sorry, something went wrong. Please try again." };
  }
  return { ok: true, message: "Your quote has been declined. We hope to cater for you another time." };
}

/** Customer uploads proof of deposit payment (Supabase Storage). */
export async function uploadPaymentReceipt(formData: FormData): Promise<ActionResult> {
  const id = String(formData.get("bookingId") || "");
  const file = formData.get("receipt");
  if (!id) return { ok: false, message: "Missing booking reference." };

  if (id === "demo") {
    return { ok: true, message: "Thank you! Your payment is being reviewed (demo)." };
  }

  const supabase = createAdminSupabase();
  if (!supabase) {
    return { ok: true, message: "Thank you! Your payment is being reviewed." };
  }

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Please choose a receipt file to upload." };
  }
  if (file.size > 8 * 1024 * 1024) {
    return { ok: false, message: "That file is too large (max 8MB). Please try a smaller file." };
  }

  const ext = file.name.includes(".") ? file.name.split(".").pop() : "dat";
  const path = `${id}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("receipts")
    .upload(path, file, { contentType: file.type || undefined, upsert: false });

  if (uploadError) {
    console.error("[uploadPaymentReceipt] upload failed:", uploadError.message);
    return {
      ok: false,
      message: "Sorry, the upload failed. Please try again or email the receipt to us directly.",
    };
  }

  const { data: pub } = supabase.storage.from("receipts").getPublicUrl(path);

  const { data: booking } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  await supabase.from("payments").insert({
    booking_id: id,
    amount: (booking?.deposit_amount as number | null) ?? 0,
    receipt_url: pub?.publicUrl ?? null,
    status: "submitted",
  });

  await supabase.from("bookings").update({ status: "deposit_received" }).eq("id", id);

  if (booking) {
    try {
      await notifyNewReceipt(booking as Booking);
    } catch (err) {
      console.error("[uploadPaymentReceipt] notify failed:", err);
    }
  }

  return { ok: true, message: "Thank you! Your payment has been received and is being reviewed." };
}
