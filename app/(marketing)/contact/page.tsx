import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { getSiteSettings } from "@/lib/queries";
import { siteConfig } from "@/lib/site-config";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { ContactForm } from "@/components/forms/contact-form";
import { WhatsappIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with All Seasons Catering Company — call, WhatsApp, email or send us a message about your event.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const phone = settings.phone ?? siteConfig.contact.phone;
  const email = settings.email ?? siteConfig.contact.email;
  const address = settings.address ?? siteConfig.contact.address;
  const whatsapp = settings.whatsapp ?? siteConfig.contact.whatsapp;
  const whatsappHref = `https://wa.me/${whatsapp.replace(/\D/g, "")}`;

  const details = [
    { Icon: Phone, label: "Call us", value: phone, href: `tel:${phone.replace(/\s/g, "")}` },
    { Icon: Mail, label: "Email us", value: email, href: `mailto:${email}` },
    { Icon: MapPin, label: "Based in", value: address, href: undefined },
    { Icon: Clock, label: "Hours", value: "Mon–Sat, 9am – 7pm", href: undefined },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Contact Us"
        title="Let's talk about your event"
        description="Whether you're ready to book or just exploring, we'd love to hear from you. Reach out any way you like."
      />

      <section className="site-container py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          {/* Details */}
          <div className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {details.map((d, i) => {
                const inner = (
                  <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft transition-colors hover:border-accent/40">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                      <d.Icon className="size-5" />
                    </span>
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {d.label}
                      </div>
                      <div className="mt-0.5 font-medium">{d.value}</div>
                    </div>
                  </div>
                );
                return (
                  <Reveal key={d.label} index={i}>
                    {d.href ? (
                      <a href={d.href} className="block">
                        {inner}
                      </a>
                    ) : (
                      inner
                    )}
                  </Reveal>
                );
              })}
            </div>

            <Reveal index={4}>
              <div className="rounded-2xl bg-primary p-6 text-primary-foreground shadow-soft">
                <h3 className="font-display text-lg font-medium">Prefer WhatsApp?</h3>
                <p className="mt-1 text-sm text-primary-foreground/80">
                  Message us directly for a quick response.
                </p>
                <Button asChild variant="gold" className="mt-4">
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                    <WhatsappIcon className="size-4" /> Chat on WhatsApp
                  </a>
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Form */}
          <Reveal>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
