"use client";

import { Ac, Panel, Sk } from "../previews/_kit";

/** Core card preview: GPU-only (translate / scale / opacity), plays on card hover. */
export default function ContextMenuPreview() {
  return (
    <div className="relative h-24 w-44 rounded-lg border border-[var(--muted-foreground)]/30 border-dashed">
      <Panel className="absolute top-6 left-12 flex origin-top-left scale-90 flex-col gap-1.5 p-2 opacity-0 transition-[translate,scale,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100">
        <Sk className="h-1.5 w-20 rounded-full" />
        <Ac className="h-1.5 w-16 rounded-full" />
        <Sk className="h-1.5 w-12 rounded-full" />
      </Panel>
    </div>
  );
}
