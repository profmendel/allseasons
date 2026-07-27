"use client";

import * as React from "react";
import type { GalleryEvent } from "@/types/db";
import { cn } from "@/lib/utils";
import { EventCard } from "@/components/cards/event-card";

export function EventsGallery({ events }: { events: GalleryEvent[] }) {
  const types = React.useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => e.event_type && set.add(e.event_type));
    return ["All", ...Array.from(set)];
  }, [events]);

  const [active, setActive] = React.useState("All");

  const filtered =
    active === "All" ? events : events.filter((e) => e.event_type === active);

  return (
    <div>
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {types.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setActive(type)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-all",
              active === type
                ? "border-primary bg-primary text-primary-foreground shadow-soft"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((event) => (
          <EventCard key={event.id} event={event} className="h-full" />
        ))}
      </div>
    </div>
  );
}
