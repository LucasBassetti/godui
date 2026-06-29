"use client";

import { Ac, Sk } from "./_kit";

export default function CardSwapPreview() {
  return (
    <div className="relative h-24 w-36">
      <Sk className="absolute top-6 right-0 h-16 w-28 rounded-xl" />
      <Sk className="absolute top-3 right-2 h-16 w-28 rounded-xl bg-[var(--muted-foreground)]/15" />
      <div className="absolute top-0 right-4 h-16 w-28 origin-bottom space-y-1.5 rounded-xl border border-border bg-card p-3 shadow-lg transition-all duration-300 group-hover:translate-y-6 group-hover:rotate-6 group-hover:opacity-0">
        <Ac className="size-5 rounded-md" />
        <Sk className="h-1.5 w-2/3 rounded-full" />
      </div>
    </div>
  );
}
