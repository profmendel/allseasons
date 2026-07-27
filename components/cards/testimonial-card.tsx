import { Quote, Star } from "lucide-react";
import type { Testimonial } from "@/types/db";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function TestimonialCard({
  testimonial,
  className,
}: {
  testimonial: Testimonial;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "flex h-full flex-col rounded-3xl border border-border bg-card p-7 shadow-soft",
        className,
      )}
    >
      <Quote className="size-8 text-accent/30" />

      <div className="mt-2 flex gap-0.5" aria-label={`${testimonial.rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "size-4",
              i < testimonial.rating
                ? "fill-accent text-accent"
                : "fill-muted text-muted",
            )}
          />
        ))}
      </div>

      <blockquote className="mt-4 flex-1 text-pretty text-[0.975rem] leading-relaxed text-foreground/90">
        “{testimonial.quote}”
      </blockquote>

      <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/10 font-display text-sm font-semibold text-primary">
          {initials(testimonial.author_name)}
        </span>
        <span className="flex flex-col">
          <span className="font-medium text-foreground">{testimonial.author_name}</span>
          {testimonial.author_role && (
            <span className="text-sm text-muted-foreground">{testimonial.author_role}</span>
          )}
        </span>
      </figcaption>
    </figure>
  );
}
