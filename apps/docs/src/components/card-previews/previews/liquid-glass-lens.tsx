"use client";

import { Sk } from "./_kit";

export default function LiquidGlassLensPreview() {
  return (
    <div className="relative grid size-24 place-items-center overflow-hidden rounded-xl bg-[var(--muted-foreground)]/15">
      <div className="absolute inset-0 flex flex-col justify-center gap-2 p-4">
        <Sk className="h-2 w-full rounded-full" />
        <Sk className="h-2 w-3/4 rounded-full" />
        <Sk className="h-2 w-5/6 rounded-full" />
      </div>
      <div className="size-12 rounded-full border border-white/40 bg-white/10 shadow-lg backdrop-blur-[2px] transition-transform duration-500 group-hover:translate-x-4" />
    </div>
  );
}
