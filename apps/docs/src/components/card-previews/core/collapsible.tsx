"use client";

import { Ac, Sk } from "../previews/_kit";

/** Core card preview: GPU-only (translate / scale / opacity), plays on card hover. */
export default function CollapsiblePreview() {
  return (
    <div className="relative h-24 w-44">
      <div className="flex flex-col gap-1.5">
        <Sk className="h-2 w-28 rounded-full" />
        <Sk className="h-5 w-44 rounded-md" />
      </div>
      <div className="absolute inset-x-0 top-[2.1rem] flex flex-col gap-1.5 opacity-0 transition-[translate,scale,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:delay-100">
        <Sk className="h-5 w-44 rounded-md" />
      </div>
      <Ac className="absolute inset-x-0 top-[2.1rem] h-5 rounded-md transition-[translate,scale,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-[1.6rem]" />
    </div>
  );
}
