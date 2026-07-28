import type { Metadata } from "next";
import { ChefHat, Heart, Leaf, Sparkles } from "lucide-react";
import { getSiteSettings, getStats } from "@/lib/queries";
import { PageHeader } from "@/components/page-header";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { Media } from "@/components/media";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "The story, values and people behind All Seasons Catering Company — Nigeria's premium event caterer.",
};

const values = [
  { Icon: ChefHat, title: "Culinary Excellence", desc: "Every dish is prepared by experienced chefs using time-honoured recipes and modern technique." },
  { Icon: Heart, title: "Genuine Hospitality", desc: "We treat your guests like our own — warm, attentive and gracious from arrival to farewell." },
  { Icon: Sparkles, title: "Obsessive Detail", desc: "From plating to presentation, the small things are what make a celebration feel extraordinary." },
  { Icon: Leaf, title: "Fresh & Quality", desc: "We source the freshest ingredients so every plate tastes as good as it looks." },
];

export default async function AboutPage() {
  const [settings, stats] = await Promise.all([getSiteSettings(), getStats()]);

  return (
    <>
      <PageHeader
        eyebrow="Our Story"
        title="Bringing elegance and flavour to every season"
        description={settings.about_short}
      />

      {/* Story */}
      <section className="site-container py-20 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="order-2 lg:order-1">
            <div className="flex flex-col gap-5 text-[1.05rem] leading-relaxed text-muted-foreground">
              <p>
                All Seasons Catering Company was founded on a simple belief: that great food, served
                with genuine care, has the power to turn any gathering into a lasting memory.
              </p>
              <p>
                What began as a passion for cooking for family and friends has grown into one of
                Nigeria&apos;s most trusted catering companies — serving weddings, corporate events,
                church programmes and private celebrations across the country.
              </p>
              <p>
                Today, our team of chefs, planners and service staff bring the same warmth and
                attention to a 40-guest dinner as we do to a 1,200-guest convention. Whatever the
                season, whatever the occasion, we&apos;re honoured to be part of your story.
              </p>
            </div>
          </Reveal>

          <Reveal className="order-1 lg:order-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-lift">
                <Media alt="Chefs plating a dish" label="Our Kitchen" />
              </div>
              <div className="mt-8 grid gap-4">
                <div className="relative aspect-square overflow-hidden rounded-3xl shadow-lift">
                  <Media alt="Elegant table setting" label="Fine Presentation" />
                </div>
                <div className="relative aspect-square overflow-hidden rounded-3xl shadow-lift">
                  <Media alt="Happy event guests" label="Joyful Events" />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      {stats.length > 0 && (
        <section className="border-y border-border bg-primary py-16 text-primary-foreground">
          <div className="site-container grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((stat, i) => (
              <Reveal key={stat.id} index={i} className="text-center">
                <div className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
                  {stat.value}
                  <span className="text-accent">{stat.suffix}</span>
                </div>
                <div className="mt-2 text-sm text-primary-foreground/70">{stat.label}</div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Values */}
      <section className="site-container py-20 md:py-28">
        <SectionHeading
          eyebrow="What We Stand For"
          title="The values behind every plate we serve"
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <Reveal key={v.title} index={i}>
              <div className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
                <span className="grid size-12 place-items-center rounded-xl bg-accent/12 text-accent">
                  <v.Icon className="size-6" />
                </span>
                <h3 className="font-display text-lg font-semibold tracking-tight">{v.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
