"use client";

import { Sk } from "../previews/_kit";

/** Core card preview: GPU-only (translate / scale / opacity), plays on card hover. */
export default function TooltipPreview() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex origin-bottom translate-y-1 scale-90 items-center rounded-md bg-[var(--foreground)] px-2.5 py-1.5 opacity-0 transition-[translate,scale,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
        <div className="h-1.5 w-14 rounded-full bg-[var(--background)]/70" />
      </div>
      <Sk className="size-8 rounded-md" />
    </div>
  );
}
