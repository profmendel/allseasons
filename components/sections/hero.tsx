"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import type { HeroSlide, Stat } from "@/types/db";
import { Media } from "@/components/media";
import { Button } from "@/components/ui/button";

export function Hero({ slides, stats }: { slides: HeroSlide[]; stats: Stat[] }) {
  const safeSlides = slides.length ? slides : [];
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (safeSlides.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % safeSlides.length), 6000);
    return () => clearInterval(id);
  }, [safeSlides.length]);

  const slide = safeSlides[index];

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-secondary/70 via-background to-background" />
      <div className="absolute -left-24 top-10 -z-10 size-[30rem] rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute -right-24 top-40 -z-10 size-[34rem] rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute inset-0 -z-10 opacity-[0.03] [background-image:radial-gradient(circle_at_1px_1px,var(--foreground)_1px,transparent_0)] [background-size:26px_26px]" />

      <div className="site-container grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:py-28">
        {/* Copy */}
        <div className="flex flex-col items-start">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide?.id ?? index}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-start"
            >
              {slide?.eyebrow && (
                <span className="eyebrow mb-5 rounded-full border border-accent/25 bg-accent/10 px-3.5 py-1.5">
                  <Sparkles className="size-3.5" /> {slide.eyebrow}
                </span>
              )}
              <h1 className="max-w-xl text-balance font-display text-4xl font-medium leading-[1.06] tracking-tight sm:text-5xl md:text-6xl">
                {slide?.headline}
              </h1>
              {slide?.subheadline && (
                <p className="mt-6 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {slide.subheadline}
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/request-quote">
                Request a Quote <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/packages">View Packages</Link>
            </Button>
          </div>

          {/* Slide dots */}
          {safeSlides.length > 1 && (
            <div className="mt-8 flex items-center gap-2">
              {safeSlides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  aria-label={`Show slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? "w-7 bg-accent" : "w-2.5 bg-foreground/20 hover:bg-foreground/40"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Stats */}
          {stats.length > 0 && (
            <dl className="mt-12 grid w-full max-w-lg grid-cols-2 gap-x-8 gap-y-6 border-t border-border pt-8 sm:grid-cols-4">
              {stats.slice(0, 4).map((stat) => (
                <div key={stat.id} className="flex flex-col">
                  <dt className="order-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {stat.label}
                  </dt>
                  <dd className="order-1 font-display text-2xl font-semibold tracking-tight sm:text-[1.75rem]">
                    {stat.value}
                    <span className="text-accent">{stat.suffix}</span>
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {/* Collage */}
        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="row-span-2 overflow-hidden rounded-3xl shadow-lift"
            >
              <div className="relative aspect-[3/4.4] w-full">
                <Media alt="Party jollof rice" label="Party Jollof" sizes="(min-width:1024px) 26vw, 50vw" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden rounded-3xl shadow-lift"
            >
              <div className="relative aspect-square w-full">
                <Media alt="Peppered chicken" label="Peppered Chicken" sizes="(min-width:1024px) 22vw, 50vw" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden rounded-3xl shadow-lift"
            >
              <div className="relative aspect-square w-full">
                <Media alt="Small chops platter" label="Small Chops" sizes="(min-width:1024px) 22vw, 50vw" />
              </div>
            </motion.div>
          </div>

          {/* Floating rating chip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-border bg-card/95 px-5 py-3 shadow-lift backdrop-blur"
          >
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-accent text-accent" />
              ))}
            </div>
            <span className="text-sm font-medium">Loved by 500+ hosts</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
