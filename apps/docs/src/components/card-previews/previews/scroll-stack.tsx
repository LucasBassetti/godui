"use client";

import { Ac, Sk } from "./_kit";

export default function ScrollStackPreview() {
  return (
    <div className="relative h-24 w-40">
      <Sk className="absolute inset-x-6 top-4 h-16 rounded-2xl" />
      <Sk className="absolute inset-x-3 top-2 h-16 rounded-2xl bg-[var(--muted-foreground)]/15" />
      <div className="absolute inset-x-0 top-0 h-16 space-y-2 rounded-2xl border border-border bg-card p-3 shadow-lg transition-transform duration-300 group-hover:-translate-y-1">
        <Ac className="h-1.5 w-10 rounded-full" />
        <Sk className="h-2 w-2/3 rounded-full" />
      </div>
    </div>
  );
}
