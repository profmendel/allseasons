import type { Metadata } from "next";
import { getTestimonials } from "@/lib/queries";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { TestimonialCard } from "@/components/cards/testimonial-card";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Hear from the families and organisations who trusted All Seasons Catering Company with their most important events.",
};

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <>
      <PageHeader
        eyebrow="Kind Words"
        title="Loved by hosts across Nigeria"
        description="We're proud of the moments we've been part of — but we'll let our clients tell you about them."
      />

      <section className="site-container py-20 md:py-28">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} index={i % 3}>
              <TestimonialCard testimonial={t} className="h-full" />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
