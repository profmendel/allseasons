"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ModeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Toggle colour theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={cn(
        "grid size-10 place-items-center rounded-full border border-border text-foreground transition-colors hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      {/* Icons toggle purely via the `.dark` class, so server and client markup
          match (no hydration mismatch, no mount flag needed). */}
      <Sun className="hidden size-[1.15rem] dark:block" />
      <Moon className="block size-[1.15rem] dark:hidden" />
    </button>
  );
}
