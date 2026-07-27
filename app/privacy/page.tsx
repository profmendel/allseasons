import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Prose } from "@/components/prose";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How All Seasons Catering Company collects, uses and protects your information.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" description="Last updated: 27 July 2026" />
      <section className="site-container py-16 md:py-20">
        <Prose>
          <p>
            This Privacy Policy explains how {siteConfig.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;)
            collects, uses and safeguards the information you provide when using our website and
            services.
          </p>

          <h2>Information we collect</h2>
          <p>When you request a quote or contact us, we may collect:</p>
          <ul>
            <li>Your name, email address and phone number</li>
            <li>Event details such as date, location, guest count and menu preferences</li>
            <li>Any additional information you choose to share with us</li>
          </ul>

          <h2>How we use your information</h2>
          <p>We use the information you provide to:</p>
          <ul>
            <li>Prepare and send you quotations and respond to enquiries</li>
            <li>Plan and deliver catering services for your event</li>
            <li>Communicate with you about your booking and payments</li>
            <li>Improve our services and website experience</li>
          </ul>

          <h2>Sharing your information</h2>
          <p>
            We do not sell your personal information. We only share it with trusted service providers
            (such as email and payment processors) where necessary to deliver our services, or where
            required by law.
          </p>

          <h2>Data storage &amp; security</h2>
          <p>
            Your information is stored securely and access is restricted to authorised personnel. We
            take reasonable technical and organisational measures to protect it against unauthorised
            access, loss or misuse.
          </p>

          <h2>Your rights</h2>
          <p>
            You may request access to, correction of, or deletion of the personal information we hold
            about you at any time by contacting us.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on this
            page with an updated revision date.
          </p>

          <h2>Contact us</h2>
          <p>
            If you have any questions about this policy, please email us at{" "}
            <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
          </p>
        </Prose>
      </section>
    </>
  );
}
