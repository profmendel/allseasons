import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Prose } from "@/components/prose";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms governing bookings and catering services with All Seasons Catering Company.",
};

export default function TermsPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms & Conditions" description="Last updated: 27 July 2026" />
      <section className="site-container py-16 md:py-20">
        <Prose>
          <p>
            These Terms &amp; Conditions govern the catering services provided by {siteConfig.name}.
            By requesting a quote or making a booking, you agree to the terms set out below.
          </p>

          <h2>Bookings &amp; quotations</h2>
          <p>
            Quotations are prepared based on the details you provide and are valid for the period
            stated on the quote. A booking is confirmed only once a deposit has been received and we
            have acknowledged it in writing.
          </p>

          <h2>Deposits &amp; payment</h2>
          <ul>
            <li>A deposit (typically 50% of the total) is required to secure your event date.</li>
            <li>The remaining balance is due before or on the event date, as agreed in your quote.</li>
            <li>Payments are made by bank transfer to the account details provided with your quote.</li>
          </ul>

          <h2>Changes &amp; cancellations</h2>
          <p>
            Changes to guest numbers, menu or event details should be communicated as early as
            possible and may affect your quote. Cancellation terms, including the treatment of
            deposits, are provided with your quotation. Deposits secure our team&apos;s availability
            and may be non-refundable within certain timeframes.
          </p>

          <h2>Menu &amp; dietary requirements</h2>
          <p>
            We will make every reasonable effort to accommodate dietary requirements and special
            requests. While we take allergies seriously, we cannot guarantee an allergen-free
            environment; please discuss any severe allergies with us in advance.
          </p>

          <h2>Liability</h2>
          <p>
            We deliver our services with care and professionalism. Our liability is limited to the
            total value of the services provided, except where liability cannot be limited by law.
          </p>

          <h2>Circumstances beyond our control</h2>
          <p>
            We are not liable for failure to perform where prevented by circumstances beyond our
            reasonable control, including extreme weather, disruptions or emergencies. In such cases
            we will work with you to find a fair resolution.
          </p>

          <h2>Governing law</h2>
          <p>These terms are governed by the laws of the Federal Republic of Nigeria.</p>

          <h2>Contact us</h2>
          <p>
            Questions about these terms? Email us at{" "}
            <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
          </p>
        </Prose>
      </section>
    </>
  );
}
