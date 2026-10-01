"use client";

import { Ac, Panel, Sk } from "../previews/_kit";

/** Core card preview: GPU-only (translate / scale / opacity), plays on card hover. */
export default function AlertDialogPreview() {
  return (
    <Panel className="flex w-44 scale-90 flex-col items-center gap-2 p-3 opacity-60 transition-[translate,scale,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100">
      <Sk className="h-2 w-24 rounded-full" />
      <Sk className="h-1.5 w-32 rounded-full" />
      <div className="mt-1 flex gap-2">
        <Sk className="h-5 w-14 rounded-md" />
        <Ac className="h-5 w-14 rounded-md" />
      </div>
    </Panel>
  );
}
