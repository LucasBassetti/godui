"use client";

import { Ac, Sk } from "./_kit";

export default function AppShowcasePreview() {
  return (
    <div className="relative h-28 w-16">
      {/* Phone shell */}
      <div className="relative size-full overflow-hidden rounded-[1.1rem] border-2 border-[var(--muted-foreground)]/30 bg-card p-1">
        {/* Notch */}
        <span className="absolute left-1/2 top-1.5 z-10 h-1.5 w-6 -translate-x-1/2 rounded-full bg-[var(--muted-foreground)]/40" />
        {/* Screen — the content strip slides up on hover (auto-scroll motif) */}
        <div className="size-full overflow-hidden rounded-[0.7rem] bg-[var(--muted-foreground)]/10">
          <div className="flex flex-col gap-1.5 p-1.5 transition-transform duration-700 ease-out group-hover:-translate-y-6">
            <Ac className="h-3 w-full rounded" />
            <Sk className="h-2 w-3/4 rounded" />
            <Sk className="h-6 w-full rounded-md" />
            <Sk className="h-2 w-2/3 rounded" />
            <Sk className="h-6 w-full rounded-md" />
            <Sk className="h-2 w-3/4 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
