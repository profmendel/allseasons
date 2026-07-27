import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conditional logic, de-duping conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as Nigerian Naira. */
export function formatNaira(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Format a date string/Date into a readable long date. */
export function formatDate(input: string | Date | null | undefined) {
  if (!input) return "";
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/** Deterministic warm-gradient pair derived from a string — used to make
 *  placeholder media tiles feel intentional rather than empty. */
export function gradientFromString(seed: string): [string, string] {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const hue = Math.abs(hash) % 40; // stay in warm amber/gold range (0–40)
  const h1 = 24 + hue;
  const h2 = 36 + hue;
  return [`hsl(${h1} 55% 34%)`, `hsl(${h2} 62% 22%)`];
}
