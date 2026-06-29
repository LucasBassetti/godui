"use client";

import { Sk } from "./_kit";

export default function HighlighterPreview() {
  return (
    <div className="space-y-2">
      <Sk className="h-3 w-32 rounded" />
      <div className="relative w-28">
        <span className="absolute inset-y-0 left-0 w-0 rounded bg-primary/40 transition-[width] duration-500 group-hover:w-full" />
        <Sk className="relative h-3 w-28 rounded" />
      </div>
    </div>
  );
}
