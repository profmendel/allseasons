import type { MenuItem } from "@/types/db";
import { cn } from "@/lib/utils";
import { Media } from "@/components/media";
import { Badge } from "@/components/ui/badge";

export function MenuItemCard({
  item,
  className,
}: {
  item: MenuItem;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift",
        className,
      )}
    >
      <div className="relative aspect-[5/4] w-full overflow-hidden">
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.05]">
          <Media
            src={item.image_url}
            alt={item.name}
            label={item.name}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          />
        </div>
        {item.is_optional_extra && (
          <div className="absolute right-3 top-3">
            <Badge variant="muted" className="glass border-white/20 text-white">
              Add-on
            </Badge>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-base font-semibold tracking-tight">{item.name}</h3>
        {item.description && (
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
        )}
      </div>
    </article>
  );
}
