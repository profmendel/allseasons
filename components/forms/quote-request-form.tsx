"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { submitQuoteRequest } from "@/lib/actions";
import { EVENT_TYPES, quoteSchema, type QuoteFormValues } from "@/lib/validators";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const selectClass =
  "flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30";

export function QuoteRequestForm({
  packages,
  defaultPackage = "",
}: {
  packages: { slug: string; name: string }[];
  defaultPackage?: string;
}) {
  const [result, setResult] = React.useState<{ reference?: string } | null>(null);

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      contact_name: "",
      contact_email: "",
      contact_phone: "",
      event_type: "",
      event_date: "",
      guest_count: "",
      location: "",
      package_slug: defaultPackage,
      special_requests: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = handleSubmit(async (values) => {
    const res = await submitQuoteRequest(values);
    if (res.ok) {
      setResult({ reference: res.reference });
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
        <h2 className="mt-6 font-display text-2xl font-medium tracking-tight">
          Your request is in!
        </h2>
        <p className="mt-3 text-muted-foreground">
          Thank you for choosing All Seasons. Our team will review your event details and send a
          professional quotation to your email shortly.
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
          <Button asChild>
            <Link href="/">Back to home</Link>
          </Button>
          <Button variant="outline" onClick={() => setResult(null)}>
            Submit another request
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl" noValidate>
      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" error={errors.contact_name?.message} required>
            <Input placeholder="e.g. Chioma Okafor" aria-invalid={!!errors.contact_name} {...register("contact_name")} />
          </Field>
          <Field label="Email address" error={errors.contact_email?.message} required>
            <Input type="email" placeholder="you@email.com" aria-invalid={!!errors.contact_email} {...register("contact_email")} />
          </Field>
          <Field label="Phone / WhatsApp" error={errors.contact_phone?.message}>
            <Input placeholder="+234 800 000 0000" {...register("contact_phone")} />
          </Field>
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
          <Field label="Event date" error={errors.event_date?.message}>
            <Input type="date" {...register("event_date")} />
          </Field>
          <Field label="Number of guests" error={errors.guest_count?.message}>
            <Input inputMode="numeric" placeholder="e.g. 200" aria-invalid={!!errors.guest_count} {...register("guest_count")} />
          </Field>
          <Field label="Event location" error={errors.location?.message} className="sm:col-span-2">
            <Input placeholder="City / venue" {...register("location")} />
          </Field>
          <Field label="Preferred package" error={errors.package_slug?.message} className="sm:col-span-2">
            <select className={selectClass} defaultValue={defaultPackage} {...register("package_slug")}>
              <option value="">Not sure yet — help me choose</option>
              {packages.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Special requests" error={errors.special_requests?.message} className="sm:col-span-2">
            <Textarea
              rows={4}
              placeholder="Menu preferences, dietary needs, theme, or anything else we should know…"
              {...register("special_requests")}
            />
          </Field>
        </div>

        <Button type="submit" size="lg" className="mt-7 w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Sending…
            </>
          ) : (
            <>
              Send my quote request <ArrowRight className="size-4" />
            </>
          )}
        </Button>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          No payment required now. We&apos;ll review your details and send a tailored quotation.
        </p>
      </div>
    </form>
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
