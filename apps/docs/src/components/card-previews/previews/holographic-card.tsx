"use client";

import { Ac, Sk } from "./_kit";

export default function HolographicCardPreview() {
  return (
    <div className="[perspective:600px]">
      <div className="relative h-24 w-36 space-y-2 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-md transition-transform duration-300 [transform-style:preserve-3d] group-hover:[transform:rotateX(8deg)_rotateY(-12deg)]">
        <Ac className="size-7 rounded-xl" />
        <Sk className="h-2 w-2/3 rounded-full" />
        <Sk className="h-1.5 w-full rounded-full" />
        {/* Holo sheen — a single accent band that sweeps across on hover. */}
        <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/30 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
      </div>
    </div>
  );
}
