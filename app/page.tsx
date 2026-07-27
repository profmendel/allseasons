import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ChefHat,
  FileText,
  Mail,
  PartyPopper,
  Truck,
  Utensils,
  Wallet,
} from "lucide-react";
import {
  getEvents,
  getFaqs,
  getHeroSlides,
  getMenu,
  getPackages,
  getServices,
  getStats,
  getTestimonials,
} from "@/lib/queries";
import { Hero } from "@/components/sections/hero";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { PackageCard } from "@/components/cards/package-card";
import { MenuItemCard } from "@/components/cards/menu-item-card";
import { ServiceCard } from "@/components/cards/service-card";
import { EventCard } from "@/components/cards/event-card";
import { TestimonialCard } from "@/components/cards/testimonial-card";
import { FaqAccordion } from "@/components/faq-accordion";

const features = [
  { Icon: ChefHat, title: "Chef-Crafted Menus", desc: "Authentic Nigerian and continental dishes, cooked fresh and plated beautifully." },
  { Icon: Utensils, title: "White-Glove Service", desc: "Uniformed servers, elegant stations and setup handled end to end." },
  { Icon: Truck, title: "Nationwide & Outdoor", desc: "Fully mobile catering that delivers hot, fresh food to any venue." },
  { Icon: BadgeCheck, title: "Trusted & Dependable", desc: "Hundreds of events delivered on time, on budget and beyond expectation." },
];

const steps = [
  { Icon: FileText, title: "Request a Quote", desc: "Tell us about your event, guest count and menu preferences in a few guided steps." },
  { Icon: Mail, title: "Receive Your Quote", desc: "We prepare a detailed, professional quotation and send it straight to your inbox." },
  { Icon: Wallet, title: "Confirm & Pay Deposit", desc: "Accept online and secure your date with a simple deposit — no endless back-and-forth." },
  { Icon: PartyPopper, title: "We Cater Your Event", desc: "Relax and enjoy while our team delivers a flawless, unforgettable experience." },
];

export default async function HomePage() {
  const [heroSlides, stats, packages, menu, services, events, testimonials, faqs] =
    await Promise.all([
      getHeroSlides(),
      getStats(),
      getPackages(),
      getMenu(),
      getServices(),
      getEvents(),
      getTestimonials(),
      getFaqs(),
    ]);

  const showcaseDishes = menu
    .flatMap((c) => c.items)
    .filter((i) => !i.is_optional_extra)
    .slice(0, 8);
  const featuredEvents = (events.filter((e) => e.is_featured).length
    ? events.filter((e) => e.is_featured)
    : events
  ).slice(0, 6);
  const featuredTestimonials = (testimonials.filter((t) => t.is_featured).length
    ? testimonials.filter((t) => t.is_featured)
    : testimonials
  ).slice(0, 3);
  const marqueeItems = services.map((s) => s.title);

  return (
    <>
      <Hero slides={heroSlides} stats={stats} />

      {/* Trust marquee */}
      {marqueeItems.length > 0 && (
        <div className="relative overflow-hidden border-y border-border bg-secondary/30 py-4">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />
          <div className="flex w-max animate-marquee items-center gap-3">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={i} className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                <span className="whitespace-nowrap">{item}</span>
                <span className="text-accent">✦</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Why choose us */}
      <section className="site-container py-20 md:py-28">
        <SectionHeading
          eyebrow="Why All Seasons"
          title="Catering you can trust with your biggest moments"
          description="From the first tasting to the final plate, every detail is handled with the care your celebration deserves."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Reveal key={f.title} index={i}>
              <div className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
                <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
                  <f.Icon className="size-6" />
                </span>
                <h3 className="font-display text-lg font-semibold tracking-tight">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section className="border-y border-border bg-secondary/30 py-20 md:py-28">
        <div className="site-container">
          <div className="flex flex-col items-end justify-between gap-6 sm:flex-row">
            <SectionHeading
              align="left"
              eyebrow="Catering Packages"
              title="Thoughtfully designed packages for every celebration"
              description="Start with a package, then customise it to your taste. Every option can be tailored to your event."
              className="sm:max-w-2xl"
            />
            <Button asChild variant="ghost" className="shrink-0">
              <Link href="/packages">
                All packages <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg, i) => (
              <Reveal key={pkg.id} index={i}>
                <PackageCard pkg={pkg} className="h-full" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Food showcase */}
      {showcaseDishes.length > 0 && (
        <section className="site-container py-20 md:py-28">
          <div className="flex flex-col items-end justify-between gap-6 sm:flex-row">
            <SectionHeading
              align="left"
              eyebrow="From Our Kitchen"
              title="Food your guests will remember"
              description="A taste of the dishes we're known for — explore the full menu to build your perfect spread."
              className="sm:max-w-2xl"
            />
            <Button asChild variant="ghost" className="shrink-0">
              <Link href="/menu">
                Full menu <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {showcaseDishes.map((item, i) => (
              <Reveal key={item.id} index={i % 4}>
                <MenuItemCard item={item} className="h-full" />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Services */}
      <section className="border-y border-border bg-secondary/30 py-20 md:py-28">
        <div className="site-container">
          <SectionHeading
            eyebrow="What We Cater"
            title="One team for every kind of occasion"
            description="Whatever you're celebrating, we bring the food, the flair and the flawless execution."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((service, i) => (
              <Reveal key={service.id} index={i % 3}>
                <ServiceCard service={service} className="h-full" />
              </Reveal>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Button asChild variant="outline">
              <Link href="/services">
                Explore all services <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Recent events */}
      <section className="site-container py-20 md:py-28">
        <div className="flex flex-col items-end justify-between gap-6 sm:flex-row">
          <SectionHeading
            align="left"
            eyebrow="Recent Events"
            title="A glimpse of the celebrations we've catered"
            description="From 40-guest private dinners to 1,200-guest conventions — see us in our element."
            className="sm:max-w-2xl"
          />
          <Button asChild variant="ghost" className="shrink-0">
            <Link href="/events">
              View gallery <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredEvents.map((event, i) => (
            <Reveal key={event.id} index={i % 3}>
              <EventCard event={event} className="h-full" />
            </Reveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-secondary/30 py-20 md:py-28">
        <div className="site-container">
          <SectionHeading
            eyebrow="How It Works"
            title="From enquiry to celebration in four simple steps"
            description="We've replaced long WhatsApp threads with a beautiful, guided booking experience."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <Reveal key={step.title} index={i}>
                <div className="relative flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <span className="absolute right-5 top-5 font-display text-4xl font-semibold text-accent/20">
                    {i + 1}
                  </span>
                  <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
                    <step.Icon className="size-6" />
                  </span>
                  <h3 className="font-display text-lg font-semibold tracking-tight">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Button asChild size="lg">
              <Link href="/request-quote">
                Start your quote <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="site-container py-20 md:py-28">
        <SectionHeading
          eyebrow="Kind Words"
          title="Hosts love catering with All Seasons"
          description="Don't just take our word for it — hear from the families and organisations we've served."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {featuredTestimonials.map((t, i) => (
            <Reveal key={t.id} index={i}>
              <TestimonialCard testimonial={t} className="h-full" />
            </Reveal>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Button asChild variant="outline">
            <Link href="/testimonials">
              Read more reviews <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* FAQ preview */}
      <section className="border-t border-border bg-secondary/30 py-20 md:py-28">
        <div className="site-container grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            align="left"
            eyebrow="Good to Know"
            title="Frequently asked questions"
            description="Everything you need to know before booking. Can't find your answer? Just get in touch."
          />
          <div>
            <FaqAccordion faqs={faqs.slice(0, 6)} />
            <Button asChild variant="ghost" className="mt-6">
              <Link href="/faq">
                All questions <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
