"use client";

import { Ac, Sk } from "../previews/_kit";

/** Core card preview: GPU-only (translate / scale / opacity), plays on card hover. */
export default function TogglePreview() {
  return (
    <div className="flex gap-2">
      <div className="relative flex size-9 items-center justify-center rounded-md border border-[var(--muted-foreground)]/25">
        <Ac className="absolute inset-0 rounded-md opacity-0 transition-[translate,scale,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100" />
        <Sk className="relative h-3 w-2 rounded-sm" />
      </div>
      <div className="flex size-9 items-center justify-center rounded-md border border-[var(--muted-foreground)]/25">
        <Sk className="h-3 w-2 rounded-sm" />
      </div>
    </div>
  );
}
