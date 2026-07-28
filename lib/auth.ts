import type { User } from "@supabase/supabase-js";
import { createServerSupabase } from "@/lib/supabase/server";

/** Emails permitted to access the admin dashboard. */
export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedAdmin(email?: string | null): boolean {
  if (!email) return false;
  const allow = getAdminEmails();
  // If an allowlist is configured, enforce it; otherwise any authenticated user.
  return allow.length === 0 || allow.includes(email.toLowerCase());
}

/** Returns the signed-in admin user, or null if not authenticated/allowed. */
export async function getAdminUser(): Promise<User | null> {
  const supabase = await createServerSupabase();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isAllowedAdmin(user.email)) return null;
  return user;
}
