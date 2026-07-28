"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { getAdminUser } from "@/lib/auth";
import { CONTENT, type ContentEntity } from "@/lib/admin-content-config";

type Result = { ok: boolean; message: string; id?: string; url?: string };

async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) throw new Error("Not authorised");
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function revalidateContent(entity: ContentEntity) {
  // Refresh the whole public site (ISR) + admin so edits appear immediately.
  revalidatePath("/", "layout");
  revalidatePath(`/admin/content/${entity.key}`);
}

/** Build a DB patch object from submitted values, coerced per field type. */
function buildPatch(entity: ContentEntity, values: Record<string, unknown>): { patch: Record<string, unknown>; error?: string } {
  const patch: Record<string, unknown> = {};

  for (const f of entity.fields) {
    const raw = values[f.name];
    switch (f.type) {
      case "number": {
        const n = raw === "" || raw == null ? null : Number(raw);
        patch[f.name] = n != null && Number.isFinite(n) ? n : null;
        break;
      }
      case "boolean":
        patch[f.name] = Boolean(raw);
        break;
      case "tags": {
        let arr: string[] = [];
        if (Array.isArray(raw)) arr = raw.map((x) => String(x).trim()).filter(Boolean);
        else if (typeof raw === "string") arr = raw.split("\n").map((s) => s.trim()).filter(Boolean);
        patch[f.name] = arr;
        break;
      }
      default: {
        const s = typeof raw === "string" ? raw.trim() : raw == null ? "" : String(raw);
        patch[f.name] = s === "" ? null : s;
      }
    }
    if (f.required && (patch[f.name] == null || patch[f.name] === "")) {
      return { patch, error: `${f.label} is required.` };
    }
  }

  // Derive slug when the entity uses one and it was left blank.
  if (entity.slugFrom && entity.fields.some((f) => f.name === "slug") && !patch.slug) {
    patch.slug = slugify(String(values[entity.slugFrom] ?? "")) || `item-${Date.now()}`;
  }

  return { patch };
}

export async function saveContent(
  entityKey: string,
  id: string | null,
  values: Record<string, unknown>,
): Promise<Result> {
  await requireAdmin();
  const entity = CONTENT[entityKey];
  if (!entity) return { ok: false, message: "Unknown content type." };
  const supabase = createAdminSupabase();
  if (!supabase) return { ok: false, message: "Supabase not configured." };

  const { patch, error: buildError } = buildPatch(entity, values);
  if (buildError) return { ok: false, message: buildError };

  if (!id) {
    if (entity.hasSort) {
      const { data: maxRow } = await supabase
        .from(entity.table)
        .select(entity.orderBy)
        .order(entity.orderBy, { ascending: false })
        .limit(1)
        .maybeSingle();
      const maxVal = maxRow ? Number((maxRow as unknown as Record<string, unknown>)[entity.orderBy]) : 0;
      patch[entity.orderBy] = (Number.isFinite(maxVal) ? maxVal : 0) + 1;
    }
    const { data, error } = await supabase.from(entity.table).insert(patch).select("id").single();
    if (error) return { ok: false, message: error.message };
    revalidateContent(entity);
    return { ok: true, message: `${entity.singular} created.`, id: (data as { id: string }).id };
  }

  const { error } = await supabase.from(entity.table).update(patch).eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidateContent(entity);
  return { ok: true, message: `${entity.singular} saved.`, id };
}

export async function deleteContentRow(entityKey: string, id: string): Promise<Result> {
  await requireAdmin();
  const entity = CONTENT[entityKey];
  if (!entity) return { ok: false, message: "Unknown content type." };
  const supabase = createAdminSupabase();
  if (!supabase) return { ok: false, message: "Supabase not configured." };

  const { error } = await supabase.from(entity.table).delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidateContent(entity);
  return { ok: true, message: `${entity.singular} deleted.` };
}

export async function toggleActiveRow(
  entityKey: string,
  id: string,
  isActive: boolean,
): Promise<Result> {
  await requireAdmin();
  const entity = CONTENT[entityKey];
  if (!entity || !entity.hasActive) return { ok: false, message: "Not supported." };
  const supabase = createAdminSupabase();
  if (!supabase) return { ok: false, message: "Supabase not configured." };

  const { error } = await supabase.from(entity.table).update({ is_active: isActive }).eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidateContent(entity);
  return { ok: true, message: isActive ? "Shown on website." : "Hidden from website." };
}

export async function moveRow(
  entityKey: string,
  id: string,
  direction: "up" | "down",
): Promise<Result> {
  await requireAdmin();
  const entity = CONTENT[entityKey];
  if (!entity || !entity.hasSort) return { ok: false, message: "Not supported." };
  const supabase = createAdminSupabase();
  if (!supabase) return { ok: false, message: "Supabase not configured." };

  const { data } = await supabase
    .from(entity.table)
    .select(`id, ${entity.orderBy}`)
    .order(entity.orderBy, { ascending: true });
  const rows = (data ?? []) as unknown as Record<string, unknown>[];
  const idx = rows.findIndex((r) => r.id === id);
  const swap = direction === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swap < 0 || swap >= rows.length) return { ok: true, message: "" };

  const a = rows[idx];
  const b = rows[swap];
  await supabase.from(entity.table).update({ [entity.orderBy]: b[entity.orderBy] }).eq("id", a.id as string);
  await supabase.from(entity.table).update({ [entity.orderBy]: a[entity.orderBy] }).eq("id", b.id as string);

  revalidateContent(entity);
  return { ok: true, message: "Reordered." };
}

/** Upload an image to the public `content` bucket; returns its URL. */
export async function uploadImage(formData: FormData): Promise<Result> {
  await requireAdmin();
  const supabase = createAdminSupabase();
  if (!supabase) return { ok: false, message: "Supabase not configured." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, message: "No file selected." };
  if (file.size > 10 * 1024 * 1024) return { ok: false, message: "Image too large (max 10MB)." };

  const ext = file.name.includes(".") ? file.name.split(".").pop() : "png";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from("content")
    .upload(path, file, { contentType: file.type || undefined, upsert: false });
  if (error) return { ok: false, message: `Upload failed: ${error.message}` };

  const { data } = supabase.storage.from("content").getPublicUrl(path);
  return { ok: true, message: "Image uploaded.", url: data.publicUrl };
}

/** Update the single site_settings row. */
export async function saveSettings(values: Record<string, unknown>): Promise<Result> {
  await requireAdmin();
  const supabase = createAdminSupabase();
  if (!supabase) return { ok: false, message: "Supabase not configured." };

  const clean: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(values)) {
    if (k === "default_deposit_percent") {
      const n = Number(v);
      clean[k] = Number.isFinite(n) ? n : 50;
    } else {
      const s = typeof v === "string" ? v.trim() : v;
      clean[k] = s === "" ? null : s;
    }
  }

  const { data: existing } = await supabase.from("site_settings").select("id").limit(1).maybeSingle();
  if (existing) {
    const { error } = await supabase
      .from("site_settings")
      .update(clean)
      .eq("id", (existing as { id: string }).id);
    if (error) return { ok: false, message: error.message };
  } else {
    const { error } = await supabase.from("site_settings").insert(clean);
    if (error) return { ok: false, message: error.message };
  }

  revalidatePath("/", "layout");
  return { ok: true, message: "Settings saved." };
}
