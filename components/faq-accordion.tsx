"use client";

import type { Faq } from "@/types/db";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqAccordion({
  faqs,
  grouped = false,
}: {
  faqs: Faq[];
  grouped?: boolean;
}) {
  if (!grouped) {
    return (
      <Accordion type="single" collapsible defaultValue={faqs[0]?.id} className="w-full">
        {faqs.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  }

  const groups = faqs.reduce<Record<string, Faq[]>>((acc, faq) => {
    const key = faq.category ?? "General";
    (acc[key] ??= []).push(faq);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-12">
      {Object.entries(groups).map(([category, items]) => (
        <div key={category}>
          <h3 className="mb-2 font-display text-xl font-semibold tracking-tight text-primary">
            {category}
          </h3>
          <Accordion type="single" collapsible className="w-full">
            {items.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ))}
    </div>
  );
}
