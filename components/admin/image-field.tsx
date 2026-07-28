"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import { uploadImage } from "@/lib/admin-content";
import { Input } from "@/components/ui/input";

export function ImageField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [busy, setBusy] = React.useState(false);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadImage(fd);
    setBusy(false);
    e.target.value = "";
    if (res.ok && res.url) {
      onChange(res.url);
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {value && (
        <div className="relative w-full max-w-xs overflow-hidden rounded-xl border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="aspect-video w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Remove image"
            className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
          >
            <X className="size-4" />
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Image URL or /images/…"
        />
        <label className="inline-flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-border px-4 text-sm font-medium transition-colors hover:bg-foreground/5">
          {busy ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          Upload
          <input type="file" accept="image/*" className="hidden" onChange={onFile} disabled={busy} />
        </label>
      </div>
    </div>
  );
}
