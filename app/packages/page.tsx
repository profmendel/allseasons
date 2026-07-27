import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { getPackages } from "@/lib/queries";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { PackageCard } from "@/components/cards/package-card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Catering Packages",
  description:
    "Silver, Gold and Platinum (VVIP) catering packages — thoughtfully designed and fully customisable for your event.",
};

const included = [
  "Professional chefs & uniformed service staff",
  "Chafing dishes, serving stations & setup",
  "Menu tailoring & tasting for larger events",
  "Nationwide delivery & outdoor catering",
];

export default async function PackagesPage() {
  const packages = await getPackages();

  return (
    <>
      <PageHeader
        eyebrow="Catering Packages"
        title="Thoughtfully designed packages for every celebration"
        description="Start with a package, then make it yours. Every option can be customised to your taste, guest count and budget."
      />

      <section className="site-container py-20 md:py-28">
        <div className="grid items-start gap-6 lg:grid-cols-3">
          {packages.map((pkg, i) => (
            <Reveal key={pkg.id} index={i}>
              <PackageCard pkg={pkg} showAllItems className="h-full" />
            </Reveal>
          ))}
        </div>

        {/* Everything includes */}
        <div className="mt-16 rounded-3xl border border-border bg-secondary/40 p-8 md:p-12">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <span className="eyebrow">Every Package Includes</span>
              <h2 className="mt-3 font-display text-2xl font-medium tracking-tight md:text-3xl">
                More than just great food
              </h2>
              <p className="mt-3 text-muted-foreground">
                Whichever package you choose, our full-service team takes care of the details so your
                day runs beautifully.
              </p>
              <Button asChild className="mt-6">
                <Link href="/request-quote">
                  Request a Quote <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
            <ul className="grid gap-3">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-xl bg-card p-4 shadow-soft">
                  <Check className="mt-0.5 size-5 shrink-0 text-primary" />
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
