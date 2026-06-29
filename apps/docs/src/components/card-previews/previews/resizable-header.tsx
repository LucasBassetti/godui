"use client";

import { Ac, Sk } from "./_kit";

export default function ResizableHeaderPreview() {
  return (
    <div className="flex h-12 w-48 items-start justify-center">
      <div className="flex items-center gap-2.5 rounded-full border border-border bg-card px-3.5 py-2 shadow-sm transition-all duration-300 group-hover:scale-90 group-hover:bg-card/80 group-hover:backdrop-blur">
        <Ac className="size-4 rounded-md" />
        <Sk className="h-2 w-10 rounded-full" />
        <Sk className="h-2 w-8 rounded-full" />
        <Sk className="h-5 w-10 rounded-full" />
      </div>
    </div>
  );
}
