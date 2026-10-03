"use client";

import { Ac, Sk } from "../previews/_kit";

/** Core card preview: GPU-only (translate / scale / opacity), plays on card hover. */
export default function ToggleGroupPreview() {
  return (
    <div className="relative flex rounded-md border border-[var(--muted-foreground)]/25">
      <Ac className="absolute top-0 left-0 h-9 w-9 rounded-md opacity-90 transition-[translate,scale,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-18" />
      {[0, 1, 2].map((cell) => (
        <div
          key={cell}
          className="relative flex size-9 items-center justify-center"
        >
          <Sk className="h-1.5 w-4 rounded-full" />
        </div>
      ))}
    </div>
  );
}
