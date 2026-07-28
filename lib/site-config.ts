/**
 * Static site configuration — navigation, brand constants and sensible
 * fallbacks. Content that the owner edits lives in the database; this file is
 * for structural things (nav, routes) and last-resort defaults.
 */

/**
 * Normalise the site URL into a valid absolute URL. Accepts values with or
 * without a scheme (e.g. "example.com" or "https://example.com") so a mis-typed
 * env var can't break the build via `new URL(...)`.
 */
function resolveSiteUrl(): string {
  const fallback = "http://localhost:3000";
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return fallback;
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    return new URL(withScheme).origin;
  } catch {
    return fallback;
  }
}

export const siteConfig = {
  name: "All Seasons Catering Company",
  shortName: "All Seasons",
  monogram: "AS",
  description:
    "Premium catering for weddings, corporate events and celebrations across Nigeria. Exceptional food, flawless service, unforgettable events.",
  url: resolveSiteUrl(),
  // Fallback contact details (overridden by site_settings in the DB when set)
  contact: {
    phone: "+234 800 000 0000",
    whatsapp: "+2348000000000",
    email: "hello@allseasonscatering.ng",
    address: "Lagos, Nigeria",
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    tiktok: "https://tiktok.com",
  },
} as const;

export type NavItem = { label: string; href: string };

export const mainNav: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Packages", href: "/packages" },
  { label: "Menu", href: "/menu" },
  { label: "Events", href: "/events" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Explore",
    items: [
      { label: "About Us", href: "/about" },
      { label: "Our Services", href: "/services" },
      { label: "Packages", href: "/packages" },
      { label: "Food Menu", href: "/menu" },
    ],
  },
  {
    title: "Discover",
    items: [
      { label: "Event Gallery", href: "/events" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "Request a Quote", href: "/request-quote" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  },
];
