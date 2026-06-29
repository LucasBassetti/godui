"use client";

import { Ac } from "./_kit";

export default function GlobePreview() {
  return (
    <div className="relative grid size-20 place-items-center rounded-full bg-[var(--muted-foreground)]/10 ring-1 ring-[var(--muted-foreground)]/20 ring-inset">
      <span className="absolute inset-x-3 inset-y-0 rounded-[50%] border border-[var(--muted-foreground)]/25" />
      <span className="absolute inset-x-0 inset-y-3 rounded-[50%] border border-[var(--muted-foreground)]/25" />
      <div className="absolute inset-0 transition-transform duration-[1200ms] ease-linear group-hover:rotate-180">
        <Ac className="-translate-x-1/2 absolute top-2 left-1/2 size-2 rounded-full" />
      </div>
    </div>
  );
}
