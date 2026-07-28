/**
 * Config-driven admin content. Each entity declares its DB table, fields and
 * list columns; the generic list + editor routes and the save/delete/reorder
 * actions all read from here. Adding a new manageable content type is just a
 * new entry — no new pages.
 *
 * This module is plain data (no server imports) so it is safe to import from
 * both client components and server code.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "select"
  | "reference"
  | "tags"
  | "image"
  | "date";

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  help?: string;
  options?: { value: string; label: string }[];
  reference?: { table: string; labelField: string };
  colSpan?: 1 | 2;
  min?: number;
  max?: number;
};

export type ListColumn = {
  field: string;
  label: string;
  type?: "image" | "boolean" | "text";
};

export type ContentEntity = {
  key: string;
  table: string;
  singular: string;
  plural: string;
  description?: string;
  fields: FieldDef[];
  listColumns: ListColumn[];
  orderBy: string;
  hasSort: boolean;
  hasActive: boolean;
  slugFrom?: string; // field to derive `slug` from when left blank
};

const activeField: FieldDef = {
  name: "is_active",
  label: "Visible on website",
  type: "boolean",
  colSpan: 2,
};

export const CONTENT: Record<string, ContentEntity> = {
  packages: {
    key: "packages",
    table: "packages",
    singular: "Package",
    plural: "Packages",
    description: "Silver, Gold, Platinum and any future catering packages.",
    orderBy: "sort_order",
    hasSort: true,
    hasActive: true,
    slugFrom: "name",
    listColumns: [
      { field: "image_url", label: "", type: "image" },
      { field: "name", label: "Name" },
      { field: "tier", label: "Tier" },
      { field: "is_popular", label: "Popular", type: "boolean" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true, colSpan: 1 },
      { name: "tier", label: "Tier", type: "text", placeholder: "e.g. Gold", colSpan: 1 },
      { name: "slug", label: "Slug", type: "text", help: "Auto-generated from name if left blank.", colSpan: 1 },
      { name: "price_from", label: "Price from (₦)", type: "number", colSpan: 1 },
      { name: "price_unit", label: "Price unit", type: "text", placeholder: "per guest", colSpan: 1 },
      { name: "is_popular", label: "Mark as most popular", type: "boolean", colSpan: 1 },
      { name: "tagline", label: "Tagline", type: "text", colSpan: 2 },
      { name: "description", label: "Description", type: "textarea", colSpan: 2 },
      { name: "included_items", label: "Included items", type: "tags", help: "One item per line.", colSpan: 2 },
      { name: "image_url", label: "Image", type: "image", colSpan: 2 },
      activeField,
    ],
  },

  "menu-categories": {
    key: "menu-categories",
    table: "menu_categories",
    singular: "Menu category",
    plural: "Menu categories",
    description: "Groupings like Rice Dishes, Soups, Small Chops.",
    orderBy: "sort_order",
    hasSort: true,
    hasActive: true,
    slugFrom: "name",
    listColumns: [
      { field: "name", label: "Name" },
      { field: "slug", label: "Slug" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true, colSpan: 1 },
      { name: "slug", label: "Slug", type: "text", colSpan: 1 },
      { name: "description", label: "Description", type: "textarea", colSpan: 2 },
      activeField,
    ],
  },

  "menu-items": {
    key: "menu-items",
    table: "menu_items",
    singular: "Menu item",
    plural: "Menu items",
    description: "Individual dishes. Mark add-ons as optional extras.",
    orderBy: "sort_order",
    hasSort: true,
    hasActive: true,
    listColumns: [
      { field: "image_url", label: "", type: "image" },
      { field: "name", label: "Name" },
      { field: "is_optional_extra", label: "Add-on", type: "boolean" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true, colSpan: 1 },
      {
        name: "category_id",
        label: "Category",
        type: "reference",
        reference: { table: "menu_categories", labelField: "name" },
        colSpan: 1,
      },
      { name: "description", label: "Description", type: "textarea", colSpan: 2 },
      { name: "is_optional_extra", label: "Optional extra / add-on", type: "boolean", colSpan: 2 },
      { name: "image_url", label: "Image", type: "image", colSpan: 2 },
      activeField,
    ],
  },

  services: {
    key: "services",
    table: "services",
    singular: "Service",
    plural: "Services",
    description: "Weddings, corporate events, outdoor catering, etc.",
    orderBy: "sort_order",
    hasSort: true,
    hasActive: true,
    slugFrom: "title",
    listColumns: [
      { field: "title", label: "Title" },
      { field: "icon", label: "Icon" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, colSpan: 1 },
      { name: "slug", label: "Slug", type: "text", colSpan: 1 },
      { name: "icon", label: "Icon", type: "text", help: "A lucide icon name, e.g. Heart, Crown, Briefcase.", colSpan: 1 },
      { name: "image_url", label: "Image", type: "image", colSpan: 1 },
      { name: "description", label: "Description", type: "textarea", colSpan: 2 },
      activeField,
    ],
  },

  gallery: {
    key: "gallery",
    table: "gallery_events",
    singular: "Event",
    plural: "Event gallery",
    description: "Previous events showcased on the website.",
    orderBy: "sort_order",
    hasSort: true,
    hasActive: true,
    slugFrom: "title",
    listColumns: [
      { field: "cover_image_url", label: "", type: "image" },
      { field: "title", label: "Title" },
      { field: "event_type", label: "Type" },
      { field: "location", label: "Location" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, colSpan: 1 },
      { name: "event_type", label: "Event type", type: "text", placeholder: "Wedding", colSpan: 1 },
      { name: "slug", label: "Slug", type: "text", colSpan: 1 },
      { name: "location", label: "Location", type: "text", colSpan: 1 },
      { name: "guest_count", label: "Guest count", type: "number", colSpan: 1 },
      { name: "event_date", label: "Event date", type: "date", colSpan: 1 },
      { name: "is_featured", label: "Featured", type: "boolean", colSpan: 1 },
      { name: "description", label: "Description", type: "textarea", colSpan: 2 },
      { name: "cover_image_url", label: "Cover image", type: "image", colSpan: 2 },
      activeField,
    ],
  },

  testimonials: {
    key: "testimonials",
    table: "testimonials",
    singular: "Testimonial",
    plural: "Testimonials",
    description: "Reviews from past clients.",
    orderBy: "sort_order",
    hasSort: true,
    hasActive: true,
    listColumns: [
      { field: "author_name", label: "Author" },
      { field: "author_role", label: "Role" },
      { field: "rating", label: "Rating" },
    ],
    fields: [
      { name: "author_name", label: "Author name", type: "text", required: true, colSpan: 1 },
      { name: "author_role", label: "Role / event", type: "text", placeholder: "Wedding · Lagos", colSpan: 1 },
      { name: "rating", label: "Rating (1–5)", type: "number", min: 1, max: 5, colSpan: 1 },
      { name: "is_featured", label: "Featured", type: "boolean", colSpan: 1 },
      { name: "quote", label: "Quote", type: "textarea", required: true, colSpan: 2 },
      { name: "avatar_url", label: "Avatar image", type: "image", colSpan: 2 },
      activeField,
    ],
  },

  faqs: {
    key: "faqs",
    table: "faqs",
    singular: "FAQ",
    plural: "FAQs",
    description: "Frequently asked questions, grouped by category.",
    orderBy: "sort_order",
    hasSort: true,
    hasActive: true,
    listColumns: [
      { field: "question", label: "Question" },
      { field: "category", label: "Category" },
    ],
    fields: [
      { name: "question", label: "Question", type: "text", required: true, colSpan: 2 },
      { name: "category", label: "Category", type: "text", placeholder: "Booking", colSpan: 1 },
      { name: "answer", label: "Answer", type: "textarea", required: true, colSpan: 2 },
      activeField,
    ],
  },

  hero: {
    key: "hero",
    table: "hero_slides",
    singular: "Hero slide",
    plural: "Hero slides",
    description: "Rotating headlines in the homepage hero.",
    orderBy: "sort_order",
    hasSort: true,
    hasActive: true,
    listColumns: [
      { field: "headline", label: "Headline" },
      { field: "eyebrow", label: "Eyebrow" },
    ],
    fields: [
      { name: "eyebrow", label: "Eyebrow", type: "text", placeholder: "Premium Event Catering", colSpan: 2 },
      { name: "headline", label: "Headline", type: "text", required: true, colSpan: 2 },
      { name: "subheadline", label: "Subheadline", type: "textarea", colSpan: 2 },
      { name: "cta_label", label: "Button label", type: "text", colSpan: 1 },
      { name: "cta_href", label: "Button link", type: "text", placeholder: "/request-quote", colSpan: 1 },
      { name: "image_url", label: "Background image", type: "image", colSpan: 2 },
      activeField,
    ],
  },

  stats: {
    key: "stats",
    table: "stats",
    singular: "Stat",
    plural: "Statistics",
    description: "Headline numbers (events catered, guests served, etc.).",
    orderBy: "sort_order",
    hasSort: true,
    hasActive: true,
    listColumns: [
      { field: "label", label: "Label" },
      { field: "value", label: "Value" },
    ],
    fields: [
      { name: "value", label: "Value", type: "text", required: true, placeholder: "500", colSpan: 1 },
      { name: "suffix", label: "Suffix", type: "text", placeholder: "+", colSpan: 1 },
      { name: "label", label: "Label", type: "text", required: true, placeholder: "Events Catered", colSpan: 2 },
      activeField,
    ],
  },
};

export const CONTENT_ORDER = [
  "hero",
  "packages",
  "menu-categories",
  "menu-items",
  "gallery",
  "services",
  "testimonials",
  "faqs",
  "stats",
];

export function getEntity(key: string): ContentEntity | null {
  return CONTENT[key] ?? null;
}
