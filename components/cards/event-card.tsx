import { MapPin, Users } from "lucide-react";
import type { GalleryEvent } from "@/types/db";
import { cn } from "@/lib/utils";
import { Media } from "@/components/media";
import { Badge } from "@/components/ui/badge";

export function EventCard({
  event,
  className,
}: {
  event: GalleryEvent;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift",
        className,
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]">
          <Media
            src={event.cover_image_url}
            alt={event.title}
            label={event.title}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </div>
        {event.event_type && (
          <div className="absolute left-4 top-4">
            <Badge variant="gold" className="glass border-white/20 text-white">
              {event.event_type}
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-semibold tracking-tight">{event.title}</h3>
        {event.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {event.description}
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
          {event.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4 text-accent" /> {event.location}
            </span>
          )}
          {event.guest_count != null && (
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-4 text-accent" /> {event.guest_count.toLocaleString()} guests
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
