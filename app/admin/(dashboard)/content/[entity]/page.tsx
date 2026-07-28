import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Inbox, Plus } from "lucide-react";
import { getEntity, type ListColumn } from "@/lib/admin-content-config";
import { listContent, type ContentRow } from "@/lib/admin-content-queries";
import { RowActions } from "@/components/admin/row-actions";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false } };

function display(value: unknown, col?: ListColumn) {
  if (col?.type === "boolean") return value ? "Yes" : "No";
  if (value == null || value === "") return "—";
  return String(value);
}

function Thumb({ value }: { value: unknown }) {
  if (!value) return <div className="size-12 shrink-0 rounded-lg bg-muted" />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={String(value)} alt="" className="size-12 shrink-0 rounded-lg object-cover" />
  );
}

export default async function ContentListPage({
  params,
}: {
  params: Promise<{ entity: string }>;
}) {
  const { entity: key } = await params;
  const entity = getEntity(key);
  if (!entity) notFound();

  const rows = await listContent(entity);
  const imageCol = entity.listColumns.find((c) => c.type === "image");
  const textCols = entity.listColumns.filter((c) => c.type !== "image");

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium tracking-tight">{entity.plural}</h1>
          {entity.description && <p className="mt-1 text-muted-foreground">{entity.description}</p>}
        </div>
        <Button asChild>
          <Link href={`/admin/content/${entity.key}/new`}>
            <Plus className="size-4" /> New {entity.singular.toLowerCase()}
          </Link>
        </Button>
      </header>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card px-6 py-16 text-center shadow-soft">
          <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
            <Inbox className="size-6" />
          </span>
          <p className="font-medium">Nothing here yet</p>
          <Button asChild variant="outline" className="mt-1">
            <Link href={`/admin/content/${entity.key}/new`}>
              <Plus className="size-4" /> Add the first one
            </Link>
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <ul className="divide-y divide-border">
            {rows.map((row: ContentRow, i) => {
              const inactive = entity.hasActive && !row.is_active;
              return (
                <li
                  key={row.id}
                  className={`flex items-center gap-4 px-4 py-3 ${inactive ? "opacity-55" : ""}`}
                >
                  {imageCol && <Thumb value={row[imageCol.field]} />}
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">
                      {display(row[textCols[0]?.field], textCols[0])}
                    </div>
                    {textCols.length > 1 && (
                      <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-sm text-muted-foreground">
                        {textCols.slice(1).map((c) => (
                          <span key={c.field}>
                            {c.label}: {display(row[c.field], c)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <RowActions
                    entityKey={entity.key}
                    id={row.id}
                    isActive={Boolean(row.is_active)}
                    hasActive={entity.hasActive}
                    hasSort={entity.hasSort}
                    isFirst={i === 0}
                    isLast={i === rows.length - 1}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
