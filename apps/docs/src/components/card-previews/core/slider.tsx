"use client";

import { Ac, Sk } from "../previews/_kit";

/** Core card preview: GPU-only (translate / scale / opacity), plays on card hover. */
export default function SliderPreview() {
  return (
    <div className="relative flex h-6 w-44 items-center">
      <Sk className="h-1.5 w-full rounded-full" />
      <Ac className="absolute left-0 h-1.5 w-full origin-left scale-x-[0.35] rounded-full transition-[translate,scale,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-[0.75]" />
      <div className="absolute left-0 size-4 translate-x-[3.5rem] rounded-full border-2 border-primary bg-card transition-[translate,scale,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[8.25rem] group-hover:scale-110" />
    </div>
  );
}
