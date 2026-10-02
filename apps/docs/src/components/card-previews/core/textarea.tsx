"use client";

import { Sk } from "../previews/_kit";

/**
 * Core card preview: the ring snaps on hover, like the component's (no
 * box-shadow transition). Input Group's preview is the one that fades.
 */
export default function TextareaPreview() {
  return (
    <div className="relative flex h-20 w-44 flex-col gap-2 rounded-md border border-[var(--muted-foreground)]/25 px-3 py-3 group-hover:border-ring">
      <div className="pointer-events-none absolute -inset-px rounded-md opacity-0 ring-[3px] ring-ring/50 group-hover:opacity-100" />
      <Sk className="h-2 w-32 rounded-full" />
      <Sk className="h-2 w-24 rounded-full" />
      <Sk className="h-2 w-28 rounded-full" />
    </div>
  );
}
