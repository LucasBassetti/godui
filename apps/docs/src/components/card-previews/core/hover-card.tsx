"use client";

import { Ac, Panel, Sk } from "../previews/_kit";

/** Core card preview: GPU-only (translate / scale / opacity), plays on card hover. */
export default function HoverCardPreview() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Panel className="flex origin-bottom scale-95 items-center gap-2 p-2 opacity-0 transition-[translate,scale,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-1 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
        <Ac className="size-6 rounded-full" />
        <div className="flex flex-col gap-1">
          <Sk className="h-1.5 w-16 rounded-full" />
          <Sk className="h-1.5 w-24 rounded-full" />
        </div>
      </Panel>
      <Ac className="h-1.5 w-12 rounded-full" />
    </div>
  );
}
