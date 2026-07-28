"use client";

import * as React from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Loader2,
  Pencil,
  Sparkles,
} from "lucide-react";
import { submitBooking } from "@/lib/actions";
import { EVENT_TYPES, quoteSchema, type QuoteFormValues } from "@/lib/validators";
import type { MenuCategoryWithItems, Package } from "@/types/db";
import { cn, formatNaira } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const selectClass =
  "flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30";

const STEPS = [
  { id: "customer", title: "Your details" },
  { id: "event", title: "Event" },
  { id: "package", title: "Package" },
  { id: "menu", title: "Menu" },
  { id: "extras", title: "Extras" },
  { id: "requests", title: "Requests" },
  { id: "review", title: "Review" },
] as const;

const FIELDS_BY_STEP: Record<number, (keyof QuoteFormValues)[]> = {
  0: ["contact_name", "contact_email", "contact_phone"],
  1: ["event_type", "event_date", "event_time", "location", "guest_count"],
};

const variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 32 : -32 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -32 : 32 }),
};

export function QuoteWizard({
  packages,
  menu,
  defaultPackage = "",
}: {
  packages: Package[];
  menu: MenuCategoryWithItems[];
  defaultPackage?: string;
}) {
  const [step, setStep] = React.useState(0);
  const [direction, setDirection] = React.useState(1);
  const [selectedMains, setSelectedMains] = React.useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = React.useState<string[]>([]);
  const [result, setResult] = React.useState<{ reference?: string; bookingId?: string } | null>(
    null,
  );

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      contact_name: "",
      contact_email: "",
      contact_phone: "",
      event_type: "",
      event_date: "",
      event_time: "",
      guest_count: "",
      location: "",
      package_slug: defaultPackage,
      special_requests: "",
    },
  });

  const {
    register,
    control,
    setValue,
    trigger,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const packageSlug = useWatch({ control, name: "package_slug" });

  // Split menu into mains vs optional extras
  const mainCategories = React.useMemo(
    () =>
      menu
        .map((c) => ({ ...c, items: c.items.filter((i) => !i.is_optional_extra) }))
        .filter((c) => c.items.length > 0),
    [menu],
  );
  const extraCategories = React.useMemo(
    () =>
      menu
        .map((c) => ({ ...c, items: c.items.filter((i) => i.is_optional_extra) }))
        .filter((c) => c.items.length > 0),
    [menu],
  );
  const nameById = React.useMemo(() => {
    const m = new Map<string, string>();
    menu.forEach((c) => c.items.forEach((i) => m.set(i.id, i.name)));
    return m;
  }, [menu]);

  const selectedPackage = packages.find((p) => p.slug === packageSlug);

  const toggle = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (id: string) =>
    setter((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const toggleMain = toggle(setSelectedMains);
  const toggleExtra = toggle(setSelectedExtras);

  const goTo = (target: number) => {
    setDirection(target > step ? 1 : -1);
    setStep(target);
  };

  const next = async () => {
    const fields = FIELDS_BY_STEP[step];
    if (fields) {
      const valid = await trigger(fields);
      if (!valid) return;
    }
    goTo(Math.min(step + 1, STEPS.length - 1));
  };

  const back = () => goTo(Math.max(step - 1, 0));

  const onSubmit = handleSubmit(async (values) => {
    const extras = selectedExtras.map((id) => ({ name: nameById.get(id) ?? id }));
    const res = await submitBooking({
      ...values,
      menu_item_ids: [...selectedMains, ...selectedExtras],
      extras,
    });
    if (res.ok) {
      setResult({ reference: res.reference, bookingId: res.bookingId });
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  });

  if (result) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-8 text-center shadow-soft md:p-12">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="size-8" />
        </span>
        <h2 className="mt-6 font-display text-2xl font-medium tracking-tight">Your request is in!</h2>
        <p className="mt-3 text-muted-foreground">
          Thank you for choosing All Seasons. We&apos;ve emailed you a confirmation — our team will
          review your event details and send a professional quotation shortly.
        </p>
        {result.reference && (
          <p className="mt-4 text-sm">
            Your reference:{" "}
            <span className="rounded-md bg-secondary px-2 py-1 font-mono font-medium">
              {result.reference}
            </span>
          </p>
        )}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {result.bookingId ? (
            <Button asChild>
              <Link href={`/quote/${result.bookingId}`}>
                Track your request <ArrowRight className="size-4" />
              </Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/">Back to home</Link>
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link href="/menu">Explore the menu</Link>
          </Button>
        </div>
      </div>
    );
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="mx-auto max-w-3xl">
      {/* Stepper */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">
            Step {step + 1} of {STEPS.length}
          </p>
          <p className="font-display text-sm font-semibold text-primary">{STEPS[step].title}</p>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <div className="mt-4 hidden flex-wrap gap-1.5 md:flex">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(i)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                i === step
                  ? "bg-primary text-primary-foreground"
                  : i < step
                    ? "text-primary hover:bg-primary/10"
                    : "text-muted-foreground hover:bg-secondary",
              )}
            >
              {i < step && <Check className="size-3" />}
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Step content */}
      <form onSubmit={onSubmit} noValidate>
        <div className="min-h-[24rem] rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === 0 && (
                <StepShell title="Who is this quote for?" subtitle="We'll use these details to send your quotation.">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Full name" error={errors.contact_name?.message} required>
                      <Input placeholder="e.g. Chioma Okafor" aria-invalid={!!errors.contact_name} {...register("contact_name")} />
                    </Field>
                    <Field label="Email address" error={errors.contact_email?.message} required>
                      <Input type="email" placeholder="you@email.com" aria-invalid={!!errors.contact_email} {...register("contact_email")} />
                    </Field>
                    <Field label="Phone / WhatsApp" error={errors.contact_phone?.message} className="sm:col-span-2">
                      <Input placeholder="+234 800 000 0000" {...register("contact_phone")} />
                    </Field>
                  </div>
                </StepShell>
              )}

              {step === 1 && (
                <StepShell title="Tell us about your event" subtitle="The more we know, the more accurate your quote.">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Event type" error={errors.event_type?.message}>
                      <select className={selectClass} defaultValue="" {...register("event_type")}>
                        <option value="">Select an event type</option>
                        {EVENT_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Number of guests" error={errors.guest_count?.message}>
                      <Input inputMode="numeric" placeholder="e.g. 200" aria-invalid={!!errors.guest_count} {...register("guest_count")} />
                    </Field>
                    <Field label="Event date" error={errors.event_date?.message}>
                      <Input type="date" {...register("event_date")} />
                    </Field>
                    <Field label="Event time" error={errors.event_time?.message}>
                      <Input type="time" {...register("event_time")} />
                    </Field>
                    <Field label="Event location" error={errors.location?.message} className="sm:col-span-2">
                      <Input placeholder="City / venue" {...register("location")} />
                    </Field>
                  </div>
                </StepShell>
              )}

              {step === 2 && (
                <StepShell title="Choose a package" subtitle="Pick a starting point — you can customise everything next.">
                  <div className="grid gap-3">
                    {packages.map((pkg) => (
                      <PackageOption
                        key={pkg.slug}
                        pkg={pkg}
                        selected={packageSlug === pkg.slug}
                        onSelect={() => setValue("package_slug", pkg.slug)}
                      />
                    ))}
                    <button
                      type="button"
                      onClick={() => setValue("package_slug", "")}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors",
                        packageSlug === ""
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-foreground/30",
                      )}
                    >
                      <RadioDot selected={packageSlug === ""} />
                      <span>
                        <span className="block font-display font-semibold">Not sure yet</span>
                        <span className="text-sm text-muted-foreground">
                          Help me choose the right package for my event.
                        </span>
                      </span>
                    </button>
                  </div>
                </StepShell>
              )}

              {step === 3 && (
                <StepShell title="Select your menu" subtitle="Choose the main dishes you'd love to serve. Optional — we can advise too.">
                  {selectedPackage && (
                    <div className="mb-6 rounded-2xl border border-accent/30 bg-accent/8 p-4">
                      <p className="flex items-center gap-2 text-sm font-medium text-accent">
                        <Sparkles className="size-4" /> Your {selectedPackage.name} already includes
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {selectedPackage.included_items.slice(0, 10).map((i) => (
                          <Badge key={i} variant="muted">
                            {i}
                          </Badge>
                        ))}
                        {selectedPackage.included_items.length > 10 && (
                          <Badge variant="muted">+{selectedPackage.included_items.length - 10} more</Badge>
                        )}
                      </div>
                    </div>
                  )}
                  <SelectionGroups
                    categories={mainCategories}
                    selected={selectedMains}
                    onToggle={toggleMain}
                  />
                </StepShell>
              )}

              {step === 4 && (
                <StepShell title="Add some extras" subtitle="Small chops, sides, desserts and drinks to complete the spread.">
                  <SelectionGroups
                    categories={extraCategories}
                    selected={selectedExtras}
                    onToggle={toggleExtra}
                  />
                </StepShell>
              )}

              {step === 5 && (
                <StepShell title="Any special requests?" subtitle="Dietary needs, themes, timings or anything else we should know.">
                  <Field label="Special requests" error={errors.special_requests?.message}>
                    <Textarea
                      rows={6}
                      placeholder="e.g. We'll need vegetarian options for 20 guests, and a live jollof station…"
                      {...register("special_requests")}
                    />
                  </Field>
                </StepShell>
              )}

              {step === 6 && (
                <StepShell title="Review your request" subtitle="Check everything looks right, then send it our way.">
                  <ReviewSummary
                    values={getValues()}
                    packageName={selectedPackage?.name}
                    mains={selectedMains.map((id) => nameById.get(id) ?? id)}
                    extras={selectedExtras.map((id) => nameById.get(id) ?? id)}
                    onEdit={goTo}
                  />
                </StepShell>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Nav */}
        <div className="mt-6 flex items-center justify-between gap-4">
          <Button type="button" variant="ghost" onClick={back} disabled={step === 0} className={cn(step === 0 && "invisible")}>
            <ArrowLeft className="size-4" /> Back
          </Button>

          {step < STEPS.length - 1 ? (
            <Button type="button" size="lg" onClick={next}>
              Continue <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Sending…
                </>
              ) : (
                <>
                  Submit request <Check className="size-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

/* ---------------------------------------------------------------- helpers */

function StepShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl font-medium tracking-tight">{title}</h2>
      {subtitle && <p className="mt-1.5 text-muted-foreground">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Field({
  label,
  error,
  required,
  className,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label>
        {label}
        {required && <span className="text-accent"> *</span>}
      </Label>
      {children}
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}

function RadioDot({ selected }: { selected: boolean }) {
  return (
    <span
      className={cn(
        "grid size-5 shrink-0 place-items-center rounded-full border transition-colors",
        selected ? "border-primary" : "border-input",
      )}
    >
      {selected && <span className="size-2.5 rounded-full bg-primary" />}
    </span>
  );
}

function PackageOption({
  pkg,
  selected,
  onSelect,
}: {
  pkg: Package;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors",
        selected ? "border-primary bg-primary/5" : "border-border hover:border-foreground/30",
      )}
    >
      <span className="mt-0.5">
        <RadioDot selected={selected} />
      </span>
      <span className="flex-1">
        <span className="flex items-center gap-2">
          <span className="font-display font-semibold">{pkg.name}</span>
          {pkg.is_popular && <Badge variant="gold">Popular</Badge>}
        </span>
        {pkg.tagline && <span className="mt-0.5 block text-sm text-muted-foreground">{pkg.tagline}</span>}
      </span>
      {pkg.price_from != null && (
        <span className="shrink-0 text-right">
          <span className="block text-xs text-muted-foreground">from</span>
          <span className="font-display font-semibold">{formatNaira(pkg.price_from)}</span>
        </span>
      )}
    </button>
  );
}

function SelectionGroups({
  categories,
  selected,
  onToggle,
}: {
  categories: MenuCategoryWithItems[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  if (categories.length === 0) {
    return <p className="text-muted-foreground">No items available.</p>;
  }
  return (
    <div className="flex flex-col gap-6">
      {categories.map((category) => (
        <div key={category.id}>
          <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {category.name}
          </h3>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {category.items.map((item) => {
              const isSel = selected.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onToggle(item.id)}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-3.5 text-left transition-colors",
                    isSel ? "border-primary bg-primary/5" : "border-border hover:border-foreground/30",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border transition-colors",
                      isSel ? "border-primary bg-primary text-primary-foreground" : "border-input",
                    )}
                  >
                    {isSel && <Check className="size-3.5" />}
                  </span>
                  <span className="flex flex-col">
                    <span className="text-sm font-medium">{item.name}</span>
                    {item.description && (
                      <span className="text-xs text-muted-foreground">{item.description}</span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function ReviewSummary({
  values,
  packageName,
  mains,
  extras,
  onEdit,
}: {
  values: QuoteFormValues;
  packageName?: string;
  mains: string[];
  extras: string[];
  onEdit: (step: number) => void;
}) {
  const rows: { label: string; value: string; step: number }[] = [
    { label: "Name", value: values.contact_name || "—", step: 0 },
    { label: "Email", value: values.contact_email || "—", step: 0 },
    { label: "Phone", value: values.contact_phone || "—", step: 0 },
    { label: "Event type", value: values.event_type || "—", step: 1 },
    { label: "Date & time", value: [values.event_date, values.event_time].filter(Boolean).join(" · ") || "—", step: 1 },
    { label: "Guests", value: values.guest_count || "—", step: 1 },
    { label: "Location", value: values.location || "—", step: 1 },
    { label: "Package", value: packageName || "To be advised", step: 2 },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-start justify-between gap-3 border-b border-border pb-3">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {row.label}
              </div>
              <div className="mt-0.5 font-medium">{row.value}</div>
            </div>
            <button
              type="button"
              onClick={() => onEdit(row.step)}
              className="mt-0.5 text-muted-foreground transition-colors hover:text-primary"
              aria-label={`Edit ${row.label}`}
            >
              <Pencil className="size-3.5" />
            </button>
          </div>
        ))}
      </div>

      <ReviewChips label="Menu selections" items={mains} onEdit={() => onEdit(3)} empty="No specific dishes selected — we'll advise." />
      <ReviewChips label="Extras" items={extras} onEdit={() => onEdit(4)} empty="No extras selected." />

      {values.special_requests && (
        <div>
          <div className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Special requests
            <button type="button" onClick={() => onEdit(5)} className="text-muted-foreground hover:text-primary">
              <Pencil className="size-3.5" />
            </button>
          </div>
          <p className="rounded-xl bg-secondary/60 p-3 text-sm leading-relaxed">{values.special_requests}</p>
        </div>
      )}
    </div>
  );
}

function ReviewChips({
  label,
  items,
  onEdit,
  empty,
}: {
  label: string;
  items: string[];
  onEdit: () => void;
  empty: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
        <button type="button" onClick={onEdit} className="text-muted-foreground hover:text-primary" aria-label={`Edit ${label}`}>
          <Pencil className="size-3.5" />
        </button>
      </div>
      {items.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {items.map((i) => (
            <Badge key={i} variant="default">
              {i}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{empty}</p>
      )}
    </div>
  );
}
