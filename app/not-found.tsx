import Link from "next/link";
import { ArrowRight, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="site-container flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <span className="grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">
        <UtensilsCrossed className="size-8" />
      </span>
      <p className="eyebrow mt-8">Error 404</p>
      <h1 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">
        This page has left the table
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back to
        something delicious.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/">Back to home</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/request-quote">
            Request a Quote <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
