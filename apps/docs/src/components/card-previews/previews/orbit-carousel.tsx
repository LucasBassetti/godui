"use client";

import { Ac, Sk } from "./_kit";

export default function OrbitCarouselPreview() {
  return (
    <div className="relative h-24 w-40 overflow-hidden">
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-center transition-transform duration-500 group-hover:-rotate-6 [transform-origin:50%_120%]">
        <Sk className="h-12 w-8 origin-bottom -mr-2 -rotate-[26deg] rounded-lg opacity-50" />
        <Sk className="h-14 w-9 origin-bottom -mr-1 -rotate-[13deg] rounded-lg opacity-75" />
        <div className="h-16 w-11 overflow-hidden rounded-lg border border-border shadow-lg">
          <Ac className="size-full" />
        </div>
        <Sk className="h-14 w-9 origin-bottom -ml-1 rotate-[13deg] rounded-lg opacity-75" />
        <Sk className="h-12 w-8 origin-bottom -ml-2 rotate-[26deg] rounded-lg opacity-50" />
      </div>
    </div>
  );
}
