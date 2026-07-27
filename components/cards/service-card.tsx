import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/types/db";
import { cn } from "@/lib/utils";
import { ServiceIcon } from "@/components/service-icon";

export function ServiceCard({
  service,
  href = "/request-quote",
  className,
}: {
  service: Service;
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lift",
        className,
      )}
    >
      <div className="absolute right-5 top-5 text-muted-foreground/40 transition-all duration-300 group-hover:right-4 group-hover:text-accent">
        <ArrowUpRight className="size-5" />
      </div>

      <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
        <ServiceIcon name={service.icon} className="size-6" />
      </span>

      <div>
        <h3 className="font-display text-lg font-semibold tracking-tight">{service.title}</h3>
        {service.description && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {service.description}
          </p>
        )}
      </div>
    </Link>
  );
}
