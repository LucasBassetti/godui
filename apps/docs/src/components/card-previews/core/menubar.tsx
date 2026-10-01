"use client";

import { Ac, Panel, Sk } from "../previews/_kit";

/** Core card preview: GPU-only (translate / scale / opacity), plays on card hover. */
export default function MenubarPreview() {
  return (
    <div className="flex flex-col items-start gap-1.5">
      <div className="flex items-center gap-1 rounded-md border border-border bg-card p-1">
        <Sk className="h-4 w-8 rounded-sm" />
        <div className="relative h-4 w-8 rounded-sm">
          <Sk className="absolute inset-0 rounded-sm" />
          <Ac className="absolute inset-0 rounded-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        <Sk className="h-4 w-8 rounded-sm" />
      </div>
      <Panel className="ml-10 flex origin-top-left scale-95 flex-col gap-1.5 p-2 opacity-0 transition-[translate,scale,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] -translate-y-1 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
        <Sk className="h-1.5 w-20 rounded-full" />
        <Ac className="h-1.5 w-16 rounded-full" />
        <Sk className="h-1.5 w-24 rounded-full" />
      </Panel>
    </div>
  );
}
