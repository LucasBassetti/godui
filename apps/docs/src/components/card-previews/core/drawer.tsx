"use client";

import { Ac, Panel, Sk } from "../previews/_kit";

/** Core card preview: GPU-only (translate / scale / opacity), plays on card hover. */
export default function DrawerPreview() {
  return (
    <div className="relative h-24 w-48 overflow-hidden rounded-lg border border-[var(--muted-foreground)]/20">
      <div className="absolute inset-3 flex flex-col gap-2">
        <Sk className="h-2 w-20 rounded-full" />
        <Sk className="h-1.5 w-32 rounded-full" />
        <Sk className="h-1.5 w-24 rounded-full" />
      </div>
      <div className="absolute inset-0 rounded-lg bg-[var(--foreground)]/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <Panel className="absolute inset-x-0 bottom-0 flex h-16 translate-y-full flex-col items-center gap-2 rounded-b-none p-2 transition-[translate,scale,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
        <Sk className="h-1 w-8 rounded-full" />
        <Sk className="h-2 w-20 rounded-full" />
        <Ac className="h-4 w-24 rounded-md" />
      </Panel>
    </div>
  );
}
