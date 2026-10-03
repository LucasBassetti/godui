"use client";

import { Ac, Sk } from "../previews/_kit";

/** Core card preview: GPU-only (translate / scale / opacity), plays on card hover. */
export default function TabsPreview() {
  return (
    <div className="relative flex h-9 w-48 items-center rounded-lg bg-[var(--muted-foreground)]/15 p-1">
      <Ac className="absolute top-1 left-1 h-7 w-[calc(33.333%-0.333rem)] rounded-md transition-[translate,scale,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[calc(100%+0.25rem)]" />
      <div className="relative grid w-full grid-cols-3 place-items-center">
        <Sk className="h-2 w-8 rounded-full" />
        <Sk className="h-2 w-8 rounded-full" />
        <Sk className="h-2 w-8 rounded-full" />
      </div>
    </div>
  );
}
