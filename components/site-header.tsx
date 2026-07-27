"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { mainNav } from "@/lib/site-config";
import { Logo } from "@/components/logo";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    const raf = requestAnimationFrame(onScroll); // async initial read (lint-safe)
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "glass border-b border-border/70 shadow-soft"
          : "border-b border-transparent",
      )}
    >
      <div className="site-container flex h-16 items-center justify-between gap-4 md:h-18">
        <Logo />

        <nav className="hidden items-center gap-0.5 lg:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "text-primary"
                  : "text-foreground/70 hover:text-foreground",
              )}
            >
              {item.label}
              {isActive(item.href) && (
                <span className="absolute inset-x-3.5 -bottom-0.5 h-px bg-accent" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle className="hidden sm:grid" />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/request-quote">
              Request a Quote <ArrowRight className="size-4" />
            </Link>
          </Button>

          {/* Mobile menu */}
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className="grid size-10 place-items-center rounded-full border border-border text-foreground transition-colors hover:bg-foreground/5 lg:hidden"
              >
                <Menu className="size-5" />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out" />
              <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-sm flex-col bg-background shadow-lift data-[state=open]:animate-slide-in-right data-[state=closed]:animate-slide-out-right">
                <div className="flex h-16 items-center justify-between border-b border-border px-5">
                  <Logo />
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close menu"
                      className="grid size-10 place-items-center rounded-full border border-border text-foreground transition-colors hover:bg-foreground/5"
                    >
                      <X className="size-5" />
                    </button>
                  </Dialog.Close>
                </div>
                <Dialog.Title className="sr-only">Navigation menu</Dialog.Title>
                <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-5">
                  {mainNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "rounded-xl px-4 py-3 font-display text-lg font-medium transition-colors",
                        isActive(item.href)
                          ? "bg-secondary text-primary"
                          : "text-foreground hover:bg-secondary/60",
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="flex items-center gap-3 border-t border-border p-5">
                  <ModeToggle />
                  <Button asChild className="flex-1">
                    <Link href="/request-quote" onClick={() => setOpen(false)}>
                      Request a Quote <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
