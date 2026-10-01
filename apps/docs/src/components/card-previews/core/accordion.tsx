"use client";

import { Ac, Sk } from "../previews/_kit";

/** Core card preview: GPU-only (translate / scale / opacity), plays on card hover. */
export default function AccordionPreview() {
  return (
    <div className="relative h-24 w-48">
      <div className="absolute inset-x-0 top-0 flex h-7 items-center justify-between border-[var(--muted-foreground)]/20 border-b">
        <Sk className="h-2 w-20 rounded-full" />
        <Sk className="size-2 rounded-sm" />
      </div>
      <div className="absolute inset-x-0 top-8 flex flex-col gap-1.5 opacity-0 transition-[translate,scale,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:delay-100">
        <Sk className="h-1.5 w-40 rounded-full" />
        <Sk className="h-1.5 w-32 rounded-full" />
      </div>
      <div className="absolute inset-x-0 top-7 flex h-7 items-center justify-between border-[var(--muted-foreground)]/20 border-t transition-[translate,scale,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-7">
        <Ac className="h-2 w-24 rounded-full" />
        <Sk className="size-2 rounded-sm" />
      </div>
      <div className="absolute inset-x-0 top-14 flex h-7 items-center justify-between border-[var(--muted-foreground)]/20 border-t transition-[translate,scale,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-7">
        <Sk className="h-2 w-16 rounded-full" />
        <Sk className="size-2 rounded-sm" />
      </div>
    </div>
  );
}
