"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { deleteContentRow, moveRow, toggleActiveRow } from "@/lib/admin-content";
import { cn } from "@/lib/utils";

type Result = { ok: boolean; message: string };

export function RowActions({
  entityKey,
  id,
  isActive,
  hasActive,
  hasSort,
  isFirst,
  isLast,
}: {
  entityKey: string;
  id: string;
  isActive: boolean;
  hasActive: boolean;
  hasSort: boolean;
  isFirst: boolean;
  isLast: boolean;
}) {
  const router = useRouter();
  const [pending, start] = React.useTransition();

  const run = (fn: () => Promise<Result>, silent = false) =>
    start(async () => {
      const res = await fn();
      if (!res.ok) toast.error(res.message);
      else if (res.message && !silent) toast.success(res.message);
      router.refresh();
    });

  return (
    <div className="flex items-center justify-end gap-1">
      {hasSort && (
        <>
          <IconBtn label="Move up" disabled={isFirst || pending} onClick={() => run(() => moveRow(entityKey, id, "up"), true)}>
            <ChevronUp className="size-4" />
          </IconBtn>
          <IconBtn label="Move down" disabled={isLast || pending} onClick={() => run(() => moveRow(entityKey, id, "down"), true)}>
            <ChevronDown className="size-4" />
          </IconBtn>
        </>
      )}
      {hasActive && (
        <IconBtn
          label={isActive ? "Hide from website" : "Show on website"}
          disabled={pending}
          onClick={() => run(() => toggleActiveRow(entityKey, id, !isActive))}
        >
          {isActive ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
        </IconBtn>
      )}
      <Link
        href={`/admin/content/${entityKey}/${id}`}
        aria-label="Edit"
        className="grid size-8 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
      >
        <Pencil className="size-4" />
      </Link>
      <IconBtn
        label="Delete"
        destructive
        disabled={pending}
        onClick={() => {
          if (window.confirm("Delete this item? This cannot be undone.")) {
            run(() => deleteContentRow(entityKey, id));
          }
        }}
      >
        <Trash2 className="size-4" />
      </IconBtn>
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  disabled,
  destructive,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  destructive?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "grid size-8 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40",
        destructive && "hover:border-destructive/40 hover:text-destructive",
      )}
    >
      {children}
    </button>
  );
}
