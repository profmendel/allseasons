import { z } from "zod";

/** Shared validation — imported by both client forms and server actions. */

export const EVENT_TYPES = [
  "Wedding",
  "Traditional Marriage",
  "Birthday Party",
  "Corporate Event",
  "Church Program",
  "Outdoor Catering",
  "Graduation Ceremony",
  "Naming Ceremony",
  "Funeral Reception",
  "Private Party",
  "Government Event",
  "Other",
] as const;

// Every field is a required string (empty strings allowed where optional) so the
// zod input and output types match — this keeps react-hook-form + zodResolver
// typing clean. The server action converts/normalises values on submit.
export const quoteSchema = z.object({
  contact_name: z.string().trim().min(2, "Please enter your name"),
  contact_email: z.string().trim().email("Enter a valid email address"),
  contact_phone: z.string().trim().max(40),
  event_type: z.string().max(80),
  event_date: z.string().max(30),
  guest_count: z
    .string()
    .refine((v) => v === "" || (/^\d+$/.test(v) && Number(v) > 0), "Enter a valid number of guests"),
  location: z.string().trim().max(200),
  package_slug: z.string().max(80),
  special_requests: z.string().trim().max(2000),
});

export type QuoteFormValues = z.infer<typeof quoteSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().max(40),
  subject: z.string().trim().max(120),
  message: z.string().trim().min(10, "Please tell us a little more about your event").max(2000),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export type ActionResult = {
  ok: boolean;
  message: string;
  reference?: string;
};
