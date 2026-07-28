import { createAdminSupabase } from "@/lib/supabase/admin";
import type { ContentEntity } from "@/lib/admin-content-config";

export type ContentRow = Record<string, unknown> & { id: string };
export type RefOptions = Record<string, { value: string; label: string }[]>;

/** All rows for an entity, in display order. Service-role — server only. */
export async function listContent(entity: ContentEntity): Promise<ContentRow[]> {
  const supabase = createAdminSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from(entity.table)
    .select("*")
    .order(entity.orderBy, { ascending: true });
  return (data as ContentRow[]) ?? [];
}

export async function getContentRow(
  entity: ContentEntity,
  id: string,
): Promise<ContentRow | null> {
  const supabase = createAdminSupabase();
  if (!supabase) return null;
  const { data } = await supabase.from(entity.table).select("*").eq("id", id).maybeSingle();
  return (data as ContentRow) ?? null;
}

/** Options for any `reference` fields (e.g. menu item → category). */
export async function getReferenceOptions(entity: ContentEntity): Promise<RefOptions> {
  const supabase = createAdminSupabase();
  const out: RefOptions = {};
  if (!supabase) return out;

  for (const field of entity.fields) {
    if (field.type === "reference" && field.reference) {
      const { data } = await supabase
        .from(field.reference.table)
        .select(`id, ${field.reference.labelField}`)
        .order(field.reference.labelField, { ascending: true });
      const rows = (data ?? []) as unknown as Record<string, unknown>[];
      out[field.name] = rows.map((r) => ({
        value: String(r.id),
        label: String(r[field.reference!.labelField] ?? ""),
      }));
    }
  }
  return out;
}
