import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarCheck, ClipboardList, Utensils } from "lucide-react";
import { getServices } from "@/lib/queries";
import { PageHeader } from "@/components/page-header";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { ServiceCard } from "@/components/cards/service-card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "From weddings and traditional marriages to corporate and outdoor events, All Seasons caters every occasion across Nigeria.",
};

const approach = [
  { Icon: ClipboardList, title: "We listen first", desc: "Every event is unique. We start by understanding your vision, guest count and budget." },
  { Icon: Utensils, title: "We craft the menu", desc: "Together we design a menu that reflects your taste, culture and the occasion." },
  { Icon: CalendarCheck, title: "We deliver flawlessly", desc: "On the day, our team handles setup, service and clean-up so you can simply enjoy." },
];

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <PageHeader
        eyebrow="What We Cater"
        title="One team for every kind of occasion"
        description="Whatever you're celebrating, we bring the food, the flair and the flawless execution — at any scale, anywhere in Nigeria."
      >
        <Button asChild size="lg">
          <Link href="/request-quote">
            Request a Quote <ArrowRight className="size-4" />
          </Link>
        </Button>
      </PageHeader>

      <section className="site-container py-20 md:py-28">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.id} index={i % 3}>
              <ServiceCard service={service} className="h-full" />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-secondary/30 py-20 md:py-28">
        <div className="site-container">
          <SectionHeading
            eyebrow="Our Approach"
            title="Effortless from first hello to final plate"
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {approach.map((step, i) => (
              <Reveal key={step.title} index={i}>
                <div className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-7 shadow-soft">
                  <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
                    <step.Icon className="size-6" />
                  </span>
                  <h3 className="font-display text-xl font-semibold tracking-tight">{step.title}</h3>
                  <p className="leading-relaxed text-muted-foreground">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
