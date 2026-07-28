import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Your Quotation",
  robots: { index: false, follow: false },
};

export default function QuoteIndexPage() {
  return (
    <>
      <PageHeader
        eyebrow="Customer Portal"
        title="Find your quotation"
        description="Open the personalised link we emailed you to view your quote, accept it online and pay your deposit."
      />
      <section className="site-container py-16 text-center md:py-24">
        <p className="mx-auto max-w-md text-muted-foreground">
          Can&apos;t find your link? We&apos;re happy to resend it — just reach out.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/contact">Contact us</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/request-quote">Request a new quote</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
