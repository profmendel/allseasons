import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

export function Logo({
  className,
  textClassName,
  showText = true,
}: {
  className?: string;
  textClassName?: string;
  showText?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label={siteConfig.name}
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span className="grid size-10 place-items-center rounded-xl bg-primary font-display text-base font-semibold text-primary-foreground shadow-soft ring-1 ring-inset ring-white/10 transition-transform duration-300 group-hover:-rotate-6">
        {siteConfig.monogram}
      </span>
      {showText && (
        <span className={cn("flex flex-col leading-none", textClassName)}>
          <span className="font-display text-[1.05rem] font-semibold tracking-tight">
            All Seasons
          </span>
          <span className="mt-0.5 text-[0.6rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Catering Co.
          </span>
        </span>
      )}
    </Link>
  );
}
