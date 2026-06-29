"use client";

import { Sk } from "./_kit";

export default function MegaMenuPreview() {
  return (
    <div className="w-48 overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between px-3 py-2.5">
        <Sk className="h-2.5 w-16 rounded-full" />
        <div className="flex flex-col gap-[3px]">
          <span className="h-0.5 w-4 rounded bg-[var(--muted-foreground)]/40" />
          <span className="h-0.5 w-4 rounded bg-[var(--muted-foreground)]/40" />
          <span className="h-0.5 w-4 rounded bg-[var(--muted-foreground)]/40" />
        </div>
      </div>
      <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 group-hover:grid-rows-[1fr]">
        <div className="overflow-hidden">
          <div className="space-y-1.5 border-border border-t p-2.5">
            <Sk className="h-2 w-3/4 rounded-full" />
            <Sk className="h-2 w-2/3 rounded-full" />
            <Sk className="h-2 w-1/2 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
