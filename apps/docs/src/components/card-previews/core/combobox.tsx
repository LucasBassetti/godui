"use client";

import { Ac, Panel, Sk } from "../previews/_kit";

/** Core card preview: GPU-only (translate / scale / opacity), plays on card hover. */
export default function ComboboxPreview() {
  return (
    <div className="relative flex w-44 flex-col gap-1.5">
      <div className="flex h-7 items-center gap-1 rounded-md border border-[var(--muted-foreground)]/25 px-1.5">
        <Ac className="h-3.5 w-8 rounded-sm" />
        <Ac className="h-3.5 w-10 rounded-sm" />
        <Ac className="h-3.5 w-6 scale-50 rounded-sm opacity-0 transition-[translate,scale,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100" />
      </div>
      <Panel className="flex origin-top flex-col gap-1.5 p-2 opacity-0 transition-[translate,scale,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] -translate-y-1 group-hover:translate-y-0 group-hover:opacity-100">
        <Sk className="h-1.5 w-28 rounded-full" />
        <Sk className="h-1.5 w-20 rounded-full" />
      </Panel>
    </div>
  );
}
