import { cn } from "@/lib/utils";
import { Reveal } from "@/components/reveal";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  align = "center",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  align?: "center" | "left";
}) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-secondary/60 to-background" />
      <div className="absolute -right-20 -top-20 -z-10 size-96 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute -left-24 top-10 -z-10 size-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="site-container py-16 md:py-24">
        <Reveal
          className={cn(
            "flex flex-col gap-5",
            align === "center" ? "mx-auto max-w-3xl items-center text-center" : "max-w-3xl items-start text-left",
          )}
        >
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1 className="text-balance font-display text-4xl font-medium tracking-tight sm:text-5xl md:text-[3.25rem] md:leading-[1.05]">
            {title}
          </h1>
          {description && (
            <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {description}
            </p>
          )}
          {children && <div className="mt-2 flex flex-wrap items-center gap-3">{children}</div>}
        </Reveal>
      </div>
    </section>
  );
}
