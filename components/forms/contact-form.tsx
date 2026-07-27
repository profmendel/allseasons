"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { submitContact } from "@/lib/actions";
import { contactSchema, type ContactFormValues } from "@/lib/validators";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [sent, setSent] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    const res = await submitContact(values);
    if (res.ok) {
      setSent(true);
      reset();
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  });

  if (sent) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-border bg-card p-8 text-center shadow-soft">
        <span className="grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="size-7" />
        </span>
        <h3 className="mt-5 font-display text-xl font-medium tracking-tight">Message sent</h3>
        <p className="mt-2 text-muted-foreground">
          Thanks for reaching out — we&apos;ll get back to you very soon.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" error={errors.name?.message} required>
          <Input placeholder="Your name" aria-invalid={!!errors.name} {...register("name")} />
        </Field>
        <Field label="Email" error={errors.email?.message} required>
          <Input type="email" placeholder="you@email.com" aria-invalid={!!errors.email} {...register("email")} />
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          <Input placeholder="+234 800 000 0000" {...register("phone")} />
        </Field>
        <Field label="Subject" error={errors.subject?.message}>
          <Input placeholder="e.g. Wedding enquiry" {...register("subject")} />
        </Field>
        <Field label="Message" error={errors.message?.message} required className="sm:col-span-2">
          <Textarea rows={5} placeholder="Tell us about your event…" aria-invalid={!!errors.message} {...register("message")} />
        </Field>
      </div>
      <Button type="submit" size="lg" className="mt-6 w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            Send message <Send className="size-4" />
          </>
        )}
      </Button>
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
