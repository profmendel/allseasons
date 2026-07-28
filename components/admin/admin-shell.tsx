"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Briefcase,
  CalendarCheck,
  HelpCircle,
  Images,
  LayoutDashboard,
  List,
  LogOut,
  Package,
  Settings,
  Sparkles,
  Star,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { signOutAdmin } from "@/lib/admin-actions";
import { CONTENT, CONTENT_ORDER } from "@/lib/admin-content-config";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

type NavItem = { label: string; href: string; icon: LucideIcon };

const MAIN: NavItem[] = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
];

const CONTENT_ICONS: Record<string, LucideIcon> = {
  hero: Sparkles,
  packages: Package,
  "menu-categories": List,
  "menu-items": UtensilsCrossed,
  gallery: Images,
  services: Briefcase,
  testimonials: Star,
  faqs: HelpCircle,
  stats: BarChart3,
};

const CONTENT_NAV: NavItem[] = CONTENT_ORDER.map((key) => ({
  label: CONTENT[key].plural,
  href: `/admin/content/${key}`,
  icon: CONTENT_ICONS[key] ?? List,
}));

const SITE: NavItem[] = [{ label: "Settings", href: "/admin/settings", icon: Settings }];

export function AdminShell({
  userEmail,
  children,
}: {
  userEmail: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const linkClass = (href: string) =>
    cn(
      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
      isActive(href)
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
    );

  const allMobile = [...MAIN, ...CONTENT_NAV, ...SITE];

  return (
    <div className="min-h-screen bg-secondary/20">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-card lg:flex">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Logo />
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {MAIN.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass(item.href)}>
              <item.icon className="size-[1.15rem]" />
              {item.label}
            </Link>
          ))}

          <p className="px-3 pb-2 pt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
            Content
          </p>
          {CONTENT_NAV.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass(item.href)}>
              <item.icon className="size-[1.15rem]" />
              {item.label}
            </Link>
          ))}

          <p className="px-3 pb-2 pt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
            Site
          </p>
          {SITE.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass(item.href)}>
              <item.icon className="size-[1.15rem]" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border p-4">
          <p className="truncate px-1 pb-2 text-xs text-muted-foreground" title={userEmail}>
            {userEmail}
          </p>
          <form action={signOutAdmin}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="size-[1.15rem]" /> Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
        <Logo />
        <form action={signOutAdmin}>
          <button type="submit" aria-label="Sign out" className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground">
            <LogOut className="size-4" />
          </button>
        </form>
      </div>
      <div className="no-scrollbar sticky top-14 z-30 flex gap-2 overflow-x-auto border-b border-border bg-card px-4 py-2 lg:hidden">
        {allMobile.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium",
              isActive(item.href) ? "bg-primary text-primary-foreground" : "text-muted-foreground",
            )}
          >
            <item.icon className="size-4" /> {item.label}
          </Link>
        ))}
      </div>

      {/* Content */}
      <div className="lg:pl-64">
        <main className="mx-auto max-w-6xl p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
