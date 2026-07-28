/**
 * Data-access layer for public content.
 *
 * Each function attempts to read from Supabase and transparently falls back to
 * bundled seed content when the project isn't configured or a query fails. This
 * lets the marketing site render fully today and go live the moment real
 * Supabase credentials are added — no code changes required.
 */

import { createPublicSupabase } from "@/lib/supabase/server";
import {
  seedFaqs,
  seedGalleryEvents,
  seedHeroSlides,
  seedMenuCategories,
  seedMenuItems,
  seedPackages,
  seedServices,
  seedSiteSettings,
  seedStats,
  seedTestimonials,
} from "@/lib/seed";
import type {
  Faq,
  GalleryEvent,
  HeroSlide,
  MenuCategoryWithItems,
  MenuItem,
  Package,
  Service,
  SiteSettings,
  Stat,
  Testimonial,
} from "@/types/db";

async function fetchOrSeed<T>(
  table: string,
  seed: T[],
  build: (q: NonNullable<Awaited<ReturnType<typeof createPublicSupabase>>>) => PromiseLike<{
    data: T[] | null;
    error: unknown;
  }>,
): Promise<T[]> {
  const supabase = createPublicSupabase();
  if (!supabase) return seed;
  try {
    const { data, error } = await build(supabase);
    if (error || !data || data.length === 0) return seed;
    return data;
  } catch {
    return seed;
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = createPublicSupabase();
  if (!supabase) return seedSiteSettings;
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (error || !data) return seedSiteSettings;
    return data as SiteSettings;
  } catch {
    return seedSiteSettings;
  }
}

export async function getStats(): Promise<Stat[]> {
  return fetchOrSeed("stats", seedStats, (s) =>
    s.from("stats").select("*").eq("is_active", true).order("sort_order"),
  );
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  return fetchOrSeed("hero_slides", seedHeroSlides, (s) =>
    s.from("hero_slides").select("*").eq("is_active", true).order("sort_order"),
  );
}

export async function getServices(): Promise<Service[]> {
  return fetchOrSeed("services", seedServices, (s) =>
    s.from("services").select("*").eq("is_active", true).order("sort_order"),
  );
}

export async function getPackages(): Promise<Package[]> {
  return fetchOrSeed("packages", seedPackages, (s) =>
    s.from("packages").select("*").eq("is_active", true).order("sort_order"),
  );
}

export async function getPackageBySlug(slug: string): Promise<Package | null> {
  const packages = await getPackages();
  return packages.find((p) => p.slug === slug) ?? null;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return fetchOrSeed("testimonials", seedTestimonials, (s) =>
    s.from("testimonials").select("*").eq("is_active", true).order("sort_order"),
  );
}

export async function getFaqs(): Promise<Faq[]> {
  return fetchOrSeed("faqs", seedFaqs, (s) =>
    s.from("faqs").select("*").eq("is_active", true).order("sort_order"),
  );
}

export async function getEvents(): Promise<GalleryEvent[]> {
  return fetchOrSeed("gallery_events", seedGalleryEvents, (s) =>
    s.from("gallery_events").select("*").eq("is_active", true).order("sort_order"),
  );
}

/** Menu grouped by category, each with its items. */
export async function getMenu(): Promise<MenuCategoryWithItems[]> {
  const supabase = createPublicSupabase();

  let categories = seedMenuCategories;
  let items: MenuItem[] = seedMenuItems;

  if (supabase) {
    try {
      const [catRes, itemRes] = await Promise.all([
        supabase.from("menu_categories").select("*").eq("is_active", true).order("sort_order"),
        supabase.from("menu_items").select("*").eq("is_active", true).order("sort_order"),
      ]);
      if (!catRes.error && catRes.data && catRes.data.length > 0) {
        categories = catRes.data;
      }
      if (!itemRes.error && itemRes.data && itemRes.data.length > 0) {
        items = itemRes.data as MenuItem[];
      }
    } catch {
      // fall back to seed
    }
  }

  return categories.map((category) => ({
    ...category,
    items: items.filter((item) => item.category_id === category.id),
  }));
}
