import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFaqs } from "@/lib/queries";
import { PageHeader } from "@/components/page-header";
import { FaqAccordion } from "@/components/faq-accordion";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about booking, menus, payment and logistics with All Seasons Catering Company.",
};

export default async function FaqPage() {
  const faqs = await getFaqs();

  return (
    <>
      <PageHeader
        eyebrow="Good to Know"
        title="Frequently asked questions"
        description="Everything you need to know before booking. Can't find your answer? We're only a message away."
      />

      <section className="site-container py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <FaqAccordion faqs={faqs} grouped />

          <div className="mt-16 rounded-3xl border border-border bg-secondary/40 p-8 text-center md:p-10">
            <h2 className="font-display text-2xl font-medium tracking-tight">Still have questions?</h2>
            <p className="mx-auto mt-2 max-w-md text-muted-foreground">
              Our team is happy to help you plan the perfect event. Reach out and we&apos;ll get right
              back to you.
            </p>
            <Button asChild className="mt-6">
              <Link href="/contact">
                Contact us <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
