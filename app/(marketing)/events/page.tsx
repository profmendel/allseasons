import type { Metadata } from "next";
import { getEvents } from "@/lib/queries";
import { PageHeader } from "@/components/page-header";
import { EventsGallery } from "@/components/events-gallery";

export const metadata: Metadata = {
  title: "Event Gallery",
  description:
    "A showcase of weddings, corporate events, traditional marriages and celebrations catered by All Seasons across Nigeria.",
};

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <>
      <PageHeader
        eyebrow="Event Gallery"
        title="Celebrations we've had the honour to cater"
        description="Every event tells a story. Here's a glimpse of the weddings, celebrations and gatherings we've brought to life."
      />

      <section className="site-container py-16 md:py-24">
        <EventsGallery events={events} />
      </section>
    </>
  );
}
