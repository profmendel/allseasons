"use server";

import { Resend } from "resend";
import { createAdminSupabase } from "@/lib/supabase/admin";
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
