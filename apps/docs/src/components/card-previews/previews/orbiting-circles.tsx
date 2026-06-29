"use client";

import { Ac, Sk } from "./_kit";

export default function OrbitingCirclesPreview() {
  return (
    <div className="relative grid size-24 place-items-center">
      <Ac className="size-6 rounded-full" />
      <div className="absolute inset-0 rounded-full border border-[var(--muted-foreground)]/25 transition-transform duration-[1400ms] ease-linear group-hover:rotate-180">
        <Sk className="-translate-x-1/2 absolute top-0 left-1/2 size-3 rounded-full" />
        <Sk className="-translate-x-1/2 absolute bottom-0 left-1/2 size-3 rounded-full" />
      </div>
      <div className="absolute inset-4 rounded-full border border-dashed border-[var(--muted-foreground)]/20 transition-transform duration-1000 ease-linear group-hover:-rotate-180">
        <Sk className="-translate-y-1/2 absolute top-1/2 right-0 size-2.5 rounded-full" />
      </div>
    </div>
  );
}
