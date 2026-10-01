"use client";

import { Ac, Sk } from "../previews/_kit";

/** Core card preview: GPU-only (translate / scale / opacity), plays on card hover. */
export default function ButtonPreview() {
  return (
    <div className="flex items-center gap-3">
      <Ac className="h-9 w-28 rounded-lg transition-[translate,scale,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-95" />
      <Sk className="h-9 w-20 rounded-lg" />
    </div>
  );
}
