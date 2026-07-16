"use client";

import { Ac, Sk } from "./_kit";

// Top card slides down and recedes behind the anchor on hover — the collapse.
export default function GooeyStackPreview() {
  return (
    <div className="relative h-24 w-40">
      {/* Anchor card — stays put. */}
      <div className="absolute inset-x-0 bottom-0 h-12 space-y-1.5 rounded-2xl border border-border bg-card p-3 shadow-md">
        <Sk className="h-1.5 w-2/3 rounded-full" />
        <Ac className="h-1.5 w-1/3 rounded-full" />
      </div>
      {/* Top card — descends, shrinks, and fades behind the anchor. */}
      <div className="absolute inset-x-0 bottom-14 flex h-9 origin-bottom items-center gap-2 rounded-2xl border border-border bg-card p-2.5 shadow-md transition-all duration-500 group-hover:translate-y-9 group-hover:scale-90 group-hover:opacity-40 group-hover:blur-[1px]">
        <Sk className="size-4 rounded-md" />
        <Sk className="h-1.5 w-1/2 rounded-full" />
      </div>
    </div>
  );
}
