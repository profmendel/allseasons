import Link from "next/link";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import type { Package } from "@/types/db";
import { cn, formatNaira } from "@/lib/utils";
import { Media } from "@/components/media";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function PackageCard({
  pkg,
  showAllItems = false,
  className,
}: {
  pkg: Package;
  showAllItems?: boolean;
  className?: string;
}) {
  const featured = pkg.is_popular;
  const items = showAllItems ? pkg.included_items : pkg.included_items.slice(0, 7);
  const remaining = pkg.included_items.length - items.length;

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift",
        featured ? "border-accent/50 ring-1 ring-accent/40" : "border-border",
        className,
      )}
    >
      {featured && (
        <div className="absolute right-4 top-4 z-10">
          <Badge variant="gold" className="shadow-soft">
            <Sparkles className="size-3.5" /> Most Popular
          </Badge>
        </div>
      )}

      <div className="relative aspect-[16/10] w-full">
        <Media src={pkg.image_url} alt={pkg.name} label={pkg.tier ?? pkg.name} />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-2xl font-semibold tracking-tight">{pkg.name}</h3>
          {pkg.tier && (
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
              {pkg.tier}
            </span>
          )}
        </div>

        {pkg.tagline && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pkg.tagline}</p>
        )}

        {pkg.price_from != null && (
          <div className="mt-5 flex items-baseline gap-1.5">
            <span className="text-sm text-muted-foreground">From</span>
            <span className="font-display text-3xl font-semibold tracking-tight">
              {formatNaira(pkg.price_from)}
            </span>
            <span className="text-sm text-muted-foreground">{pkg.price_unit}</span>
          </div>
        )}

        <ul className="mt-6 flex flex-1 flex-col gap-2.5">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" />
              <span className="text-foreground/90">{item}</span>
            </li>
          ))}
          {remaining > 0 && (
            <li className="pl-[1.625rem] text-sm font-medium text-accent">+ {remaining} more dishes</li>
          )}
        </ul>

        <Button
          asChild
          variant={featured ? "default" : "outline"}
          className="mt-7 w-full"
        >
          <Link href={`/request-quote?package=${pkg.slug}`}>
            Choose this Package <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
