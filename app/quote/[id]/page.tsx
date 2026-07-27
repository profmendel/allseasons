import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBookingById } from "@/lib/bookings";
import { getPackages, getSiteSettings } from "@/lib/queries";
import { QuotePortal } from "@/components/portal/quote-portal";

export const metadata: Metadata = {
  title: "Your Quotation",
  robots: { index: false, follow: false },
};

export default async function QuotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await getBookingById(id);
  if (!booking) notFound();

  const [settings, packages] = await Promise.all([getSiteSettings(), getPackages()]);
  const packageName = booking.package_id
    ? packages.find((p) => p.id === booking.package_id)?.name
    : undefined;

  return (
    <section className="site-container py-16 md:py-24">
      <QuotePortal
        booking={booking}
        settings={settings}
        packageName={packageName}
        isDemo={id === "demo"}
      />
    </section>
  );
}
