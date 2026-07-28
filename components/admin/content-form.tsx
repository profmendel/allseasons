"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { saveContent } from "@/lib/admin-content";
import type { ContentEntity, FieldDef } from "@/lib/admin-content-config";
import type { RefOptions } from "@/lib/admin-content-queries";
import type { ContentRow } from "@/lib/admin-content-queries";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageField } from "@/components/admin/image-field";

const selectClass =
  "flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30";

type Values = Record<string, string | boolean>;

function initValues(entity: ContentEntity, row: ContentRow | null): Values {
  const v: Values = {};
  for (const f of entity.fields) {
    const raw = row ? row[f.name] : undefined;
    if (f.type === "boolean") v[f.name] = row ? Boolean(raw) : f.name === "is_active";
    else if (f.type === "tags") v[f.name] = Array.isArray(raw) ? (raw as string[]).join("\n") : "";
    else if (f.type === "date") v[f.name] = raw ? String(raw).slice(0, 10) : "";
    else v[f.name] = raw != null ? String(raw) : "";
  }
  return v;
}

export function ContentForm({
  entity,
  row,
  refOptions,
}: {
  entity: ContentEntity;
  row: ContentRow | null;
  refOptions: RefOptions;
}) {
  const router = useRouter();
  const [values, setValues] = React.useState<Values>(() => initValues(entity, row));
  const [pending, start] = React.useTransition();

  const set = (name: string, value: string | boolean) =>
    setValues((v) => ({ ...v, [name]: value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      const res = await saveContent(entity.key, row?.id ?? null, values);
      if (res.ok) {
        toast.success(res.message);
        router.push(`/admin/content/${entity.key}`);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-6 shadow-soft md:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        {entity.fields.map((f) => (
          <div key={f.name} className={cn(f.colSpan === 2 ? "sm:col-span-2" : "")}>
            {f.type === "boolean" ? (
              <Toggle
                label={f.label}
                checked={values[f.name] as boolean}
                onChange={(c) => set(f.name, c)}
              />
            ) : (
              <div className="flex flex-col gap-2">
                <Label>
                  {f.label}
                  {f.required && <span className="text-accent"> *</span>}
                </Label>
                <FieldControl
                  field={f}
                  value={values[f.name] as string}
                  onChange={(val) => set(f.name, val)}
                  options={f.type === "reference" ? refOptions[f.name] : f.options}
                />
                {f.help && <p className="text-xs text-muted-foreground">{f.help}</p>}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-7 flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {row ? "Save changes" : `Create ${entity.singular.toLowerCase()}`}
        </Button>
        <Button asChild variant="ghost">
          <Link href={`/admin/content/${entity.key}`}>Cancel</Link>
        </Button>
      </div>
    </form>
  );
}

function FieldControl({
  field,
  value,
  onChange,
  options,
}: {
  field: FieldDef;
  value: string;
  onChange: (v: string) => void;
  options?: { value: string; label: string }[];
}) {
  switch (field.type) {
    case "textarea":
    case "tags":
      return (
        <Textarea
          rows={field.type === "tags" ? 6 : 4}
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "number":
      return (
        <Input
          inputMode="decimal"
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "date":
      return <Input type="date" value={value} onChange={(e) => onChange(e.target.value)} />;
    case "image":
      return <ImageField value={value} onChange={onChange} />;
    case "select":
    case "reference":
      return (
        <select className={selectClass} value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">— None —</option>
          {(options ?? []).map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    default:
      return (
        <Input
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (c: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-border bg-background px-4 py-3 text-left"
    >
      <span className="text-sm font-medium">{label}</span>
      <span
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-muted-foreground/30",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-[1.375rem]" : "translate-x-0.5",
          )}
        />
      </span>
    </button>
  );
}
