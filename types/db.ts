// TypeScript mirrors of the Supabase schema (supabase/migrations/0001_initial_schema.sql).
// Hand-maintained for now; can be replaced by generated types once the project
// is linked with the Supabase CLI.

export type BookingStatus =
  | "pending"
  | "quote_sent"
  | "awaiting_deposit"
  | "deposit_received"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

export type PaymentStatus = "pending" | "submitted" | "verified" | "rejected";

export interface SiteSettings {
  id: string;
  business_name: string;
  tagline: string | null;
  about_short: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  tiktok_url: string | null;
  bank_name: string | null;
  bank_account_name: string | null;
  bank_account_number: string | null;
  default_deposit_percent: number;
}

export interface Stat {
  id: string;
  label: string;
  value: string;
  suffix: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface HeroSlide {
  id: string;
  eyebrow: string | null;
  headline: string;
  subheadline: string | null;
  image_url: string | null;
  cta_label: string | null;
  cta_href: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface Package {
  id: string;
  slug: string;
  name: string;
  tier: string | null;
  tagline: string | null;
  description: string | null;
  price_from: number | null;
  price_unit: string | null;
  image_url: string | null;
  included_items: string[];
  is_popular: boolean;
  sort_order: number;
  is_active: boolean;
}

export interface MenuCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface MenuItem {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  image_url: string | null;
  is_optional_extra: boolean;
  sort_order: number;
  is_active: boolean;
}

export interface MenuCategoryWithItems extends MenuCategory {
  items: MenuItem[];
}

export interface GalleryEvent {
  id: string;
  slug: string;
  title: string;
  event_type: string | null;
  location: string | null;
  guest_count: number | null;
  event_date: string | null;
  description: string | null;
  cover_image_url: string | null;
  images: string[];
  is_featured: boolean;
  sort_order: number;
  is_active: boolean;
}

export interface Testimonial {
  id: string;
  author_name: string;
  author_role: string | null;
  quote: string;
  rating: number;
  avatar_url: string | null;
  is_featured: boolean;
  sort_order: number;
  is_active: boolean;
}

export interface Faq {
  id: string;
  category: string | null;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
}
