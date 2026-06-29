"use client";

import { Sk } from "./_kit";

export default function AccordionPreview() {
  return (
    <div className="w-48 overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between px-3 py-2.5">
        <Sk className="h-2 w-24 rounded-full" />
        <span className="size-2 rotate-45 border-[var(--muted-foreground)]/40 border-r-2 border-b-2 transition-transform duration-300 group-hover:rotate-[225deg]" />
      </div>
      <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 group-hover:grid-rows-[1fr]">
        <div className="overflow-hidden">
          <Sk className="mx-3 mb-3 h-1.5 w-3/4 rounded-full" />
        </div>
      </div>
    </div>
  );
}
