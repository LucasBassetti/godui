"use client";

import { Ac, Sk } from "../previews/_kit";

/** Core card preview: GPU-only (translate / scale / opacity), plays on card hover. */
export default function ProgressPreview() {
  return (
    <div className="relative h-2 w-44 overflow-hidden rounded-full">
      <Sk className="absolute inset-0 rounded-full" />
      <Ac className="absolute inset-0 -translate-x-3/4 rounded-full transition-[translate,scale,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0" />
    </div>
  );
}
