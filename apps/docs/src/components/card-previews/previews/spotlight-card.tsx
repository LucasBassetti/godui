"use client";

import { Ac, Sk } from "./_kit";

export default function SpotlightCardPreview() {
  return (
    <div className="relative h-24 w-36 space-y-2 overflow-hidden rounded-xl border border-border bg-card p-3">
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:radial-gradient(180px_circle_at_50%_-10%,color-mix(in_oklch,var(--primary)_22%,transparent),transparent_70%)]" />
      <Ac className="relative size-6 rounded-lg" />
      <Sk className="relative h-2 w-2/3 rounded-full" />
      <Sk className="relative h-1.5 w-full rounded-full" />
    </div>
  );
}
