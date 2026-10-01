"use client";

import { Ac, Panel, Sk } from "../previews/_kit";

/** Core card preview: GPU-only (translate / scale / opacity), plays on card hover. */
export default function SelectPreview() {
  return (
    <div className="flex w-36 flex-col gap-1.5">
      <div className="flex h-7 items-center justify-between rounded-md border border-[var(--muted-foreground)]/25 px-2">
        <Sk className="h-2 w-16 rounded-full" />
        <Sk className="size-2 rounded-sm" />
      </div>
      <Panel className="flex origin-top scale-95 flex-col gap-1.5 p-2 opacity-0 transition-[translate,scale,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100">
        <Sk className="h-1.5 w-20 rounded-full" />
        <div className="flex items-center justify-between">
          <Ac className="h-1.5 w-16 rounded-full" />
          <Ac className="size-1.5 rounded-full" />
        </div>
        <Sk className="h-1.5 w-14 rounded-full" />
      </Panel>
    </div>
  );
}
