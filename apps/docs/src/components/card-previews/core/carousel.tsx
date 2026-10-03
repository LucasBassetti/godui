"use client";

import { Ac, Sk } from "../previews/_kit";

/** Core card preview: GPU-only (translate), plays on card hover. */
export default function CarouselPreview() {
  return (
    <div className="h-16 w-44 overflow-hidden">
      <div className="flex gap-2 transition-[translate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-16">
        <Sk className="h-16 w-14 shrink-0 rounded-lg" />
        <Ac className="h-16 w-14 shrink-0 rounded-lg" />
        <Sk className="h-16 w-14 shrink-0 rounded-lg" />
        <Sk className="h-16 w-14 shrink-0 rounded-lg" />
      </div>
    </div>
  );
}
