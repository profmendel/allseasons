import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon, WhatsappIcon } from "@/components/icons";
import { footerNav, siteConfig } from "@/lib/site-config";
import { getSiteSettings } from "@/lib/queries";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export async function SiteFooter() {
  const settings = await getSiteSettings();
  const phone = settings.phone ?? siteConfig.contact.phone;
  const email = settings.email ?? siteConfig.contact.email;
  const address = settings.address ?? siteConfig.contact.address;

  const socials = [
    { label: "Instagram", href: settings.instagram_url, Icon: InstagramIcon },
    { label: "Facebook", href: settings.facebook_url, Icon: FacebookIcon },
    {
      label: "WhatsApp",
      href: settings.whatsapp ? `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}` : null,
      Icon: WhatsappIcon,
    },
  ].filter((s) => Boolean(s.href));

  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="site-container py-16 md:py-20">
        {/* CTA band */}
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-12 text-primary-foreground shadow-lift md:px-14 md:py-14">
          <div className="absolute -right-16 -top-16 size-56 rounded-full bg-accent/25 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 size-56 rounded-full bg-white/10 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-xl">
              <h2 className="text-balance font-display text-3xl font-medium tracking-tight md:text-4xl">
                Ready to plan something unforgettable?
              </h2>
              <p className="mt-3 text-primary-foreground/80">
                Tell us about your event and receive a beautifully detailed quote — no long
                WhatsApp back-and-forth, no guesswork.
              </p>
            </div>
            <Button asChild variant="gold" size="lg" className="shrink-0">
              <Link href="/request-quote">
                Request a Quote <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Main footer grid */}
        <div className="mt-16 grid grid-cols-2 gap-10 md:grid-cols-6">
          <div className="col-span-2 flex flex-col gap-5 md:col-span-2">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {settings.tagline ?? siteConfig.description}
            </p>
            {socials.length > 0 && (
              <div className="flex items-center gap-2.5">
                {socials.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid size-10 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                  >
                    <Icon className="size-[1.05rem]" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {footerNav.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <h3 className="font-display text-sm font-semibold tracking-tight">{col.title}</h3>
              <ul className="flex flex-col gap-2.5">
                {col.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 flex flex-col gap-3 md:col-span-1">
            <h3 className="font-display text-sm font-semibold tracking-tight">Get in touch</h3>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li>
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-start gap-2.5 transition-colors hover:text-foreground">
                  <Phone className="mt-0.5 size-4 shrink-0 text-accent" /> {phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="flex items-start gap-2.5 transition-colors hover:text-foreground">
                  <Mail className="mt-0.5 size-4 shrink-0 text-accent" /> {email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent" /> {address}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {settings.business_name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
