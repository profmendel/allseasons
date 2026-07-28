import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getEntity } from "@/lib/admin-content-config";
import { getContentRow, getReferenceOptions } from "@/lib/admin-content-queries";
import { ContentForm } from "@/components/admin/content-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false } };

export default async function ContentEditorPage({
  params,
}: {
  params: Promise<{ entity: string; id: string }>;
}) {
  const { entity: key, id } = await params;
  const entity = getEntity(key);
  if (!entity) notFound();

  const isNew = id === "new";
  const row = isNew ? null : await getContentRow(entity, id);
  if (!isNew && !row) notFound();

  const refOptions = await getReferenceOptions(entity);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href={`/admin/content/${entity.key}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> {entity.plural}
      </Link>
      <h1 className="font-display text-3xl font-medium tracking-tight">
        {isNew ? `New ${entity.singular.toLowerCase()}` : `Edit ${entity.singular.toLowerCase()}`}
      </h1>
      <ContentForm entity={entity} row={row} refOptions={refOptions} />
    </div>
  );
}
