-- =============================================================================
-- All Seasons Catering Company — Initial Schema
-- =============================================================================
-- Everything the marketing website and booking platform renders is stored here
-- so the business can manage content without a developer.
--
-- Conventions:
--   * uuid primary keys (gen_random_uuid)
--   * created_at / updated_at timestamptz on every table
--   * sort_order int for admin-controlled ordering
--   * is_active / is_published flags so content can be drafted then shown
--   * Row Level Security ON everywhere; anon can read only published/active rows
-- =============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- updated_at trigger helper
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type booking_status as enum (
    'pending',
    'quote_sent',
    'awaiting_deposit',
    'deposit_received',
    'confirmed',
    'in_progress',
    'completed',
    'cancelled'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_status as enum ('pending', 'submitted', 'verified', 'rejected');
exception when duplicate_object then null; end $$;

-- =============================================================================
-- SITE SETTINGS  (single-row key/value-ish config for global content)
-- =============================================================================
create table if not exists public.site_settings (
  id             uuid primary key default gen_random_uuid(),
  business_name  text not null default 'All Seasons Catering Company',
  tagline        text,
  about_short    text,
  phone          text,
  whatsapp       text,
  email          text,
  address        text,
  instagram_url  text,
  facebook_url   text,
  tiktok_url     text,
  bank_name      text,
  bank_account_name text,
  bank_account_number text,
  default_deposit_percent int not null default 50,
  singleton      boolean not null default true unique, -- enforces one row
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create trigger trg_site_settings_updated before update on public.site_settings
  for each row execute function public.set_updated_at();

-- =============================================================================
-- STATS  (homepage counters: events catered, guests served, years, etc.)
-- =============================================================================
create table if not exists public.stats (
  id          uuid primary key default gen_random_uuid(),
  label       text not null,
  value       text not null,        -- kept as text so "5,000+" etc. is possible
  suffix      text,
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger trg_stats_updated before update on public.stats
  for each row execute function public.set_updated_at();

-- =============================================================================
-- HERO SLIDES  (homepage rotating hero banners)
-- =============================================================================
create table if not exists public.hero_slides (
  id           uuid primary key default gen_random_uuid(),
  eyebrow      text,
  headline     text not null,
  subheadline  text,
  image_url    text,
  cta_label    text,
  cta_href     text,
  sort_order   int not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create trigger trg_hero_slides_updated before update on public.hero_slides
  for each row execute function public.set_updated_at();

-- =============================================================================
-- SERVICES  (wedding catering, corporate, outdoor, etc.)
-- =============================================================================
create table if not exists public.services (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  description  text,
  icon         text,                 -- lucide icon name
  image_url    text,
  sort_order   int not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create trigger trg_services_updated before update on public.services
  for each row execute function public.set_updated_at();

-- =============================================================================
-- PACKAGES  (Silver / Gold / Platinum + future packages)
-- =============================================================================
create table if not exists public.packages (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  name           text not null,
  tier           text,               -- e.g. 'Silver', 'Gold', 'Platinum (VVIP)'
  tagline        text,
  description    text,
  price_from     numeric(12,2),      -- naira, per-plate "from" price; nullable
  price_unit     text default 'per guest',
  image_url      text,
  included_items text[] not null default '{}',
  is_popular     boolean not null default false,
  sort_order     int not null default 0,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create trigger trg_packages_updated before update on public.packages
  for each row execute function public.set_updated_at();

-- =============================================================================
-- MENU CATEGORIES + ITEMS  (Rice, Soups, Proteins, Small Chops, ...)
-- =============================================================================
create table if not exists public.menu_categories (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  description  text,
  sort_order   int not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create trigger trg_menu_categories_updated before update on public.menu_categories
  for each row execute function public.set_updated_at();

create table if not exists public.menu_items (
  id           uuid primary key default gen_random_uuid(),
  category_id  uuid references public.menu_categories(id) on delete set null,
  name         text not null,
  description  text,
  image_url    text,
  is_optional_extra boolean not null default false, -- true for small chops/sides add-ons
  sort_order   int not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists idx_menu_items_category on public.menu_items(category_id);
create trigger trg_menu_items_updated before update on public.menu_items
  for each row execute function public.set_updated_at();

-- =============================================================================
-- EVENTS GALLERY  (previous jobs showcase)
-- =============================================================================
create table if not exists public.gallery_events (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  event_type   text,                 -- Wedding, Corporate, Traditional Marriage...
  location     text,
  guest_count  int,
  event_date   date,
  description  text,
  cover_image_url text,
  images       text[] not null default '{}',
  is_featured  boolean not null default false,
  sort_order   int not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create trigger trg_gallery_events_updated before update on public.gallery_events
  for each row execute function public.set_updated_at();

-- =============================================================================
-- TESTIMONIALS
-- =============================================================================
create table if not exists public.testimonials (
  id           uuid primary key default gen_random_uuid(),
  author_name  text not null,
  author_role  text,                 -- "Bride, Lagos Wedding" etc.
  quote        text not null,
  rating       int not null default 5 check (rating between 1 and 5),
  avatar_url   text,
  is_featured  boolean not null default false,
  sort_order   int not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create trigger trg_testimonials_updated before update on public.testimonials
  for each row execute function public.set_updated_at();

-- =============================================================================
-- FAQs
-- =============================================================================
create table if not exists public.faqs (
  id           uuid primary key default gen_random_uuid(),
  category     text,
  question     text not null,
  answer       text not null,
  sort_order   int not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create trigger trg_faqs_updated before update on public.faqs
  for each row execute function public.set_updated_at();

-- =============================================================================
-- CUSTOMERS + BOOKINGS + QUOTES + PAYMENTS  (booking engine — later phases)
-- Defined now so the schema is complete and stable.
-- =============================================================================
create table if not exists public.customers (
  id           uuid primary key default gen_random_uuid(),
  full_name    text not null,
  email        text not null,
  phone        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists idx_customers_email on public.customers(email);
create trigger trg_customers_updated before update on public.customers
  for each row execute function public.set_updated_at();

create table if not exists public.bookings (
  id               uuid primary key default gen_random_uuid(),
  reference        text not null unique default ('ASC-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8))),
  customer_id      uuid references public.customers(id) on delete set null,

  -- denormalised contact snapshot (form submission)
  contact_name     text not null,
  contact_email    text not null,
  contact_phone    text,

  -- event details
  event_type       text,
  event_date       date,
  event_time       text,
  location         text,
  guest_count      int,
  package_id       uuid references public.packages(id) on delete set null,
  special_requests text,

  -- selections (menu item ids + free-form extras)
  menu_item_ids    uuid[] not null default '{}',
  extras           jsonb not null default '[]',

  -- quote (built by admin)
  cost_food        numeric(12,2),
  cost_transport   numeric(12,2),
  cost_decoration  numeric(12,2),
  cost_equipment   numeric(12,2),
  cost_staff       numeric(12,2),
  discount         numeric(12,2) default 0,
  tax              numeric(12,2) default 0,
  total            numeric(12,2),
  deposit_percent  int default 50,
  deposit_amount   numeric(12,2),

  status           booking_status not null default 'pending',
  quote_sent_at    timestamptz,
  quote_expires_at timestamptz,
  accepted_at      timestamptz,
  confirmed_at     timestamptz,

  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists idx_bookings_status on public.bookings(status);
create index if not exists idx_bookings_customer on public.bookings(customer_id);
create trigger trg_bookings_updated before update on public.bookings
  for each row execute function public.set_updated_at();

create table if not exists public.payments (
  id           uuid primary key default gen_random_uuid(),
  booking_id   uuid not null references public.bookings(id) on delete cascade,
  amount       numeric(12,2) not null,
  receipt_url  text,
  status       payment_status not null default 'pending',
  note         text,
  verified_at  timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists idx_payments_booking on public.payments(booking_id);
create trigger trg_payments_updated before update on public.payments
  for each row execute function public.set_updated_at();

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================
-- Public content tables: anon may SELECT active/published rows only.
-- Writes happen through the service role (admin) which bypasses RLS.
-- Booking submissions are handled by a server action using the service role,
-- so anon has NO direct table access to bookings/customers/payments.
-- =============================================================================

alter table public.site_settings    enable row level security;
alter table public.stats             enable row level security;
alter table public.hero_slides       enable row level security;
alter table public.services          enable row level security;
alter table public.packages          enable row level security;
alter table public.menu_categories   enable row level security;
alter table public.menu_items        enable row level security;
alter table public.gallery_events    enable row level security;
alter table public.testimonials      enable row level security;
alter table public.faqs              enable row level security;
alter table public.customers         enable row level security;
alter table public.bookings          enable row level security;
alter table public.payments          enable row level security;

-- Public read policies (active rows)
create policy "public read site_settings"  on public.site_settings  for select using (true);
create policy "public read stats"          on public.stats          for select using (is_active);
create policy "public read hero_slides"    on public.hero_slides    for select using (is_active);
create policy "public read services"       on public.services       for select using (is_active);
create policy "public read packages"       on public.packages       for select using (is_active);
create policy "public read menu_categories" on public.menu_categories for select using (is_active);
create policy "public read menu_items"     on public.menu_items     for select using (is_active);
create policy "public read gallery_events" on public.gallery_events for select using (is_active);
create policy "public read testimonials"   on public.testimonials   for select using (is_active);
create policy "public read faqs"           on public.faqs           for select using (is_active);

-- customers / bookings / payments: no anon policies => access only via service role.
