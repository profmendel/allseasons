import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next 16 "proxy" convention (formerly middleware). Guards admin routes and
// refreshes the Supabase auth session.
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

// Only run on admin routes — keeps the public site fully static / ISR.
export const config = {
  matcher: ["/admin/:path*"],
};
