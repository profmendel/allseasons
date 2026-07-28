import type { Metadata } from "next";
import { getMenu, getPackages } from "@/lib/queries";
import { PageHeader } from "@/components/page-header";
import { QuoteWizard } from "@/components/forms/quote-wizard";

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Plan your event in a few guided steps and receive a tailored catering quotation from All Seasons — no long WhatsApp threads.",
};

export default async function RequestQuotePage({
  searchParams,
}: {
  searchParams: Promise<{ package?: string }>;
}) {
  const [sp, packages, menu] = await Promise.all([searchParams, getPackages(), getMenu()]);
  const defaultPackage =
    sp.package && packages.some((p) => p.slug === sp.package) ? sp.package : "";

  return (
    <>
      <PageHeader
        eyebrow="Request a Quote"
        title="Let's plan your event"
        description="Answer a few quick questions and we'll prepare a professional, tailored quotation. It only takes a couple of minutes."
      />
      <section className="site-container py-16 md:py-24">
        <QuoteWizard packages={packages} menu={menu} defaultPackage={defaultPackage} />
      </section>
    </>
  );
}
