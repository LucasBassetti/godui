"use client";

import { Ac, Panel, Sk } from "../previews/_kit";

/** Core card preview: GPU-only (translate / scale / opacity), plays on card hover. */
export default function PopoverPreview() {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <Sk className="h-6 w-20 rounded-md" />
      <Panel className="flex origin-top scale-95 flex-col gap-1.5 p-2.5 opacity-0 transition-[translate,scale,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] -translate-y-1 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
        <Sk className="h-2 w-20 rounded-full" />
        <Ac className="h-4 w-28 rounded-md" />
      </Panel>
    </div>
  );
}
