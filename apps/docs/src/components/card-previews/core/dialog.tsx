"use client";

import { Ac, Panel, Sk } from "../previews/_kit";

/** Core card preview: GPU-only (translate / scale / opacity), plays on card hover. */
export default function DialogPreview() {
  return (
    <div className="relative flex h-24 w-48 items-center justify-center rounded-lg border border-[var(--muted-foreground)]/20">
      <div className="absolute inset-3 flex flex-col gap-2">
        <Sk className="h-2 w-20 rounded-full" />
        <Sk className="h-1.5 w-32 rounded-full" />
        <Sk className="h-1.5 w-24 rounded-full" />
      </div>
      <div className="absolute inset-0 rounded-lg bg-[var(--foreground)]/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <Panel className="flex w-32 scale-90 flex-col gap-1.5 p-3 opacity-0 transition-[translate,scale,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100">
        <Sk className="h-2 w-16 rounded-full" />
        <Sk className="h-1.5 w-24 rounded-full" />
        <Ac className="mt-1 h-4 w-12 self-end rounded-md" />
      </Panel>
    </div>
  );
}
