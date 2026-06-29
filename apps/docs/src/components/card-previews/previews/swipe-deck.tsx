"use client";

import { Ac, Sk } from "./_kit";

export default function SwipeDeckPreview() {
  return (
    <div className="relative h-28 w-24">
      <Sk className="absolute inset-x-3 top-3 h-24 rounded-2xl" />
      <Sk className="absolute inset-x-1.5 top-1.5 h-24 rounded-2xl bg-[var(--muted-foreground)]/15" />
      <div className="absolute inset-x-0 top-0 h-24 origin-bottom overflow-hidden rounded-2xl border border-border bg-card shadow-xl transition-transform duration-300 group-hover:-rotate-6">
        <Ac className="h-16" />
        <div className="space-y-1.5 p-2.5">
          <Sk className="h-1.5 w-3/4 rounded-full" />
        </div>
      </div>
    </div>
  );
}
