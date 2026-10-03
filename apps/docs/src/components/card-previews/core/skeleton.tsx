"use client";

import { Sk } from "../previews/_kit";

/** Core card preview: GPU-only (translate), plays on card hover. */
export default function SkeletonPreview() {
  return (
    <div className="grid w-44 gap-2.5">
      {["w-full", "w-4/5", "w-3/5"].map((width) => (
        <div
          key={width}
          className={`relative h-2.5 overflow-hidden rounded-full ${width}`}
        >
          <Sk className="absolute inset-0 rounded-full" />
          <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-foreground/15 to-transparent transition-[translate] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-x-full" />
        </div>
      ))}
    </div>
  );
}
