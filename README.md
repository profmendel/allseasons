# All Seasons Catering Company

A premium marketing website **and** quotation/booking platform for All Seasons
Catering Company (Nigeria). Built to showcase the brand beautifully and to
replace long WhatsApp threads with a guided, professional booking experience.

> **Status:** Phase 1 — Foundation + Marketing site (complete). The database
> schema for the full booking/quote/payment flow is already in place; later
> phases build the multi-step quote builder, customer portal and admin
> dashboard on top of it.

---

## Tech stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4** + custom design system · **shadcn-style** UI primitives
- **Supabase** (Postgres, Storage, Auth) — content + bookings
- **Resend** — transactional email
- **framer-motion** — motion · **Zod** + **React Hook Form** — forms
- Deploy target: **Vercel**

## Design system

A "warm editorial luxury" direction: ivory canvas, warm ink, deep-emerald brand
and a signature gold accent, with **Fraunces** (display) + **Hanken Grotesk**
(body). Every colour is a CSS variable in [`app/globals.css`](app/globals.css) —
re-skin the whole brand from that one block. Light + dark mode supported.

---

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

The site runs immediately on **built-in seed content** — no Supabase or Resend
required for local development. It automatically switches to live data the
moment you add real credentials.

### Scripts

| Script              | Purpose                          |
| ------------------- | -------------------------------- |
| `npm run dev`       | Start the dev server             |
| `npm run build`     | Production build                 |
| `npm run start`     | Serve the production build       |
| `npm run lint`      | Lint                             |
| `npm run typecheck` | Type-check with `tsc --noEmit`   |

---

## Environment variables

Copy [`.env.example`](.env.example) to `.env.local` and fill in as services come
online. All are optional during early development.

| Variable                        | Purpose                                     |
| ------------------------------- | ------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL                        |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key (browser-safe)              |
| `SUPABASE_SERVICE_ROLE_KEY`     | **Server only** — booking writes, bypass RLS |
| `RESEND_API_KEY`                | Resend API key (email)                      |
| `RESEND_FROM_EMAIL`             | Verified "from" address                     |
| `CONTACT_TO_EMAIL`              | Where contact-form emails are delivered     |
| `NEXT_PUBLIC_SITE_URL`          | Canonical site URL (metadata, sitemap)      |

---

## Connecting Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Run the schema, then the seed, in the SQL editor (or via the Supabase CLI):
   - [`supabase/migrations/0001_initial_schema.sql`](supabase/migrations/0001_initial_schema.sql)
   - [`supabase/seed.sql`](supabase/seed.sql)
3. Create a **public Storage bucket named `receipts`** (customers upload deposit
   proof there via the quote portal).
4. Paste the project URL + keys into `.env.local`.

Preview the customer portal any time at **`/quote/demo`** — it renders a sample
quotation with the full accept → deposit → upload flow, even before Supabase is
connected.

Public content tables are protected by RLS (anon can read active rows only).
Bookings, customers and payments are written exclusively via the server-side
service role.

## Connecting Resend

Add `RESEND_API_KEY`, a verified `RESEND_FROM_EMAIL`, and `CONTACT_TO_EMAIL`.
The contact form and (later) quote emails will start sending automatically.

---

## How content works

Everything visible on the site is **data-driven** and designed to be editable
without a developer:

- `lib/queries.ts` — reads each content type from Supabase, falling back to
  bundled seed data when Supabase isn't configured or a query fails.
- `lib/seed.ts` — the seed content (also mirrored in `supabase/seed.sql`).
- Images: components render a designed gradient **placeholder** until a real
  `image_url` is provided, so nothing looks broken pre-launch. `next.config.ts`
  already allows Supabase Storage / Unsplash / Cloudinary image hosts.

## Project structure

```
app/               Routes (marketing pages, sitemap, robots, 404)
components/
  ui/              shadcn-style primitives (button, card, accordion, …)
  cards/           Reusable content cards (package, event, testimonial, …)
  sections/        Composite sections (hero, …)
  forms/           Quote request + contact forms
lib/
  supabase/        server / admin / browser clients
  queries.ts       Data-access with seed fallback
  actions.ts       Server actions (quote request, contact)
  validators.ts    Zod schemas shared by forms + actions
  seed.ts          Seed content
types/db.ts        DB row types
supabase/          SQL schema + seed
```

## Deployment (Vercel)

1. Push to GitHub and import the repo into Vercel.
2. Add the environment variables from `.env.local`.
3. Deploy. `NEXT_PUBLIC_SITE_URL` should be your production domain.

---

_Built with care for All Seasons Catering Company._
