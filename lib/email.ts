import { Resend } from "resend";
import { siteConfig } from "@/lib/site-config";
import { formatNaira, formatDate } from "@/lib/utils";
import type { Booking } from "@/types/db";

const BRAND = "#1e4a38";
const INK = "#22190f";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!key || !from) return null;
  return { resend: new Resend(key), from };
}

/** Branded HTML shell for transactional emails. */
function emailLayout({ heading, body }: { heading: string; body: string }) {
  return `
  <div style="background:#fbf7ef;padding:32px 0;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${INK};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr><td style="padding:0 24px 24px;">
            <div style="display:inline-block;width:44px;height:44px;line-height:44px;text-align:center;border-radius:12px;background:${BRAND};color:#f7f2e7;font-weight:700;font-family:Georgia,serif;">AS</div>
            <span style="margin-left:10px;font-family:Georgia,serif;font-size:18px;font-weight:600;vertical-align:middle;">All Seasons Catering</span>
          </td></tr>
          <tr><td style="background:#ffffff;border:1px solid #e7dcc7;border-radius:20px;padding:36px 32px;">
            <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:24px;font-weight:600;color:${INK};">${heading}</h1>
            ${body}
          </td></tr>
          <tr><td style="padding:24px;text-align:center;color:#6f6455;font-size:13px;">
            ${siteConfig.name}<br/>
            <a href="${siteConfig.url}" style="color:${BRAND};">${siteConfig.url.replace(/^https?:\/\//, "")}</a>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </div>`;
}

function button(label: string, href: string) {
  return `<a href="${href}" style="display:inline-block;background:${BRAND};color:#f7f2e7;text-decoration:none;padding:13px 24px;border-radius:999px;font-weight:600;font-size:15px;">${label}</a>`;
}

function row(label: string, value: string, strong = false) {
  return `<tr>
    <td style="padding:8px 0;color:#6f6455;font-size:14px;">${label}</td>
    <td style="padding:8px 0;text-align:right;font-size:14px;${strong ? `font-weight:700;color:${INK};` : ""}">${value}</td>
  </tr>`;
}

/** Sent when the admin has prepared a quote and is ready for the customer. */
export async function sendQuoteReadyEmail(booking: Booking) {
  const svc = getResend();
  if (!svc) {
    console.info("[email] Resend not configured — skipping quote email for", booking.reference);
    return { ok: false };
  }
  const quoteUrl = `${siteConfig.url}/quote/${booking.id}`;
  const deposit = booking.deposit_amount ?? null;

  const body = `
    <p style="margin:0 0 16px;line-height:1.6;color:#4a4139;">Dear ${booking.contact_name},</p>
    <p style="margin:0 0 20px;line-height:1.6;color:#4a4139;">
      Thank you for choosing All Seasons Catering Company. We're delighted to share your
      personalised quotation for your ${booking.event_type ?? "event"}${booking.event_date ? ` on ${formatDate(booking.event_date)}` : ""}.
    </p>
    <table role="presentation" width="100%" style="border-top:1px solid #e7dcc7;border-bottom:1px solid #e7dcc7;margin:8px 0 20px;">
      ${row("Estimated total", booking.total != null ? formatNaira(booking.total) : "See full quote", true)}
      ${deposit != null ? row("Deposit to secure your date", formatNaira(deposit)) : ""}
      ${booking.quote_expires_at ? row("Quote valid until", formatDate(booking.quote_expires_at)) : ""}
    </table>
    <p style="margin:0 0 24px;line-height:1.6;color:#4a4139;">
      View your full itemised quote and accept online whenever you're ready:
    </p>
    <p style="margin:0 0 8px;">${button("View & accept your quote", quoteUrl)}</p>
    <p style="margin:20px 0 0;font-size:13px;color:#6f6455;">Your reference: <strong>${booking.reference}</strong></p>
  `;

  await svc.resend.emails.send({
    from: svc.from,
    to: booking.contact_email,
    subject: `Your quotation from All Seasons Catering (${booking.reference})`,
    html: emailLayout({ heading: "Your quotation is ready", body }),
  });
  return { ok: true };
}

/** Sent once the deposit is verified and the booking is confirmed. */
export async function sendBookingConfirmedEmail(booking: Booking) {
  const svc = getResend();
  if (!svc) return { ok: false };
  const body = `
    <p style="margin:0 0 16px;line-height:1.6;color:#4a4139;">Dear ${booking.contact_name},</p>
    <p style="margin:0 0 20px;line-height:1.6;color:#4a4139;">
      Wonderful news — your booking is <strong>confirmed</strong>! We can't wait to cater your
      ${booking.event_type ?? "event"}${booking.event_date ? ` on ${formatDate(booking.event_date)}` : ""}.
    </p>
    <p style="margin:0 0 24px;line-height:1.6;color:#4a4139;">
      Our team will be in touch closer to the date to finalise the details. If you have any questions
      in the meantime, simply reply to this email.
    </p>
    <p style="margin:0 0 8px;">${button("View your booking", `${siteConfig.url}/quote/${booking.id}`)}</p>
    <p style="margin:20px 0 0;font-size:13px;color:#6f6455;">Your reference: <strong>${booking.reference}</strong></p>
  `;
  await svc.resend.emails.send({
    from: svc.from,
    to: booking.contact_email,
    subject: `Your booking is confirmed! (${booking.reference})`,
    html: emailLayout({ heading: "You're all set 🎉", body }),
  });
  return { ok: true };
}

/** Notify the business that a customer submitted a payment receipt. */
export async function notifyNewReceipt(booking: Booking) {
  const svc = getResend();
  const to = process.env.CONTACT_TO_EMAIL || process.env.RESEND_FROM_EMAIL;
  if (!svc || !to) return { ok: false };
  const body = `
    <p style="margin:0 0 16px;line-height:1.6;color:#4a4139;">
      ${booking.contact_name} (${booking.reference}) has uploaded a payment receipt.
    </p>
    <p style="margin:0 0 8px;">${button("Review in dashboard", `${siteConfig.url}/quote/${booking.id}`)}</p>
  `;
  await svc.resend.emails.send({
    from: svc.from,
    to,
    subject: `Payment receipt submitted — ${booking.reference}`,
    html: emailLayout({ heading: "New payment receipt", body }),
  });
  return { ok: true };
}
