import type { Metadata } from "next";
import { getPackages } from "@/lib/queries";
import { PageHeader } from "@/components/page-header";
import { QuoteRequestForm } from "@/components/forms/quote-request-form";

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Tell us about your event and receive a tailored catering quotation from All Seasons — no long WhatsApp threads.",
};

export default async function RequestQuotePage({
  searchParams,
}: {
  searchParams: Promise<{ package?: string }>;
}) {
  const [sp, packages] = await Promise.all([searchParams, getPackages()]);
  const packageList = packages.map((p) => ({ slug: p.slug, name: p.name }));
  const defaultPackage =
    sp.package && packageList.some((p) => p.slug === sp.package) ? sp.package : "";

  return (
    <>
      <PageHeader
        eyebrow="Request a Quote"
        title="Let's plan your event"
        description="Share a few details and we'll prepare a professional, tailored quotation. It only takes a minute."
      />
      <section className="site-container py-16 md:py-24">
        <QuoteRequestForm packages={packageList} defaultPackage={defaultPackage} />
      </section>
    </>
  );
}
