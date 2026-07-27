import { cn } from "@/lib/utils";

/** Lightweight prose styling for legal / long-form copy (no plugin needed). */
export function Prose({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "mx-auto max-w-3xl text-[1.02rem]",
        "[&>h2]:mb-3 [&>h2]:mt-10 [&>h2]:font-display [&>h2]:text-2xl [&>h2]:font-medium [&>h2]:tracking-tight [&>h2]:text-foreground",
        "[&>p]:mb-4 [&>p]:leading-relaxed [&>p]:text-muted-foreground",
        "[&>ul]:mb-4 [&>ul]:list-disc [&>ul]:space-y-1.5 [&>ul]:pl-6 [&>ul]:text-muted-foreground",
        "[&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2",
        className,
      )}
    >
      {children}
    </div>
  );
}
