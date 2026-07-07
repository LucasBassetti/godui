"use client";

import { Sk } from "./_kit";

export default function ScrollTimelinePreview() {
  return (
    <div className="relative flex h-24 w-40 flex-col justify-center gap-4 pl-6">
      {/* Rail: muted base with a growing accent overlay on hover. */}
      <span className="absolute top-2 bottom-2 left-2 w-px bg-[var(--muted-foreground)]/25" />
      <span className="absolute top-2 left-2 h-0 w-px origin-top bg-primary transition-[height] duration-700 ease-out group-hover:h-[calc(100%-1rem)]" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="-ml-[1.375rem] size-2 rounded-full border border-border bg-card" />
          <Sk className="h-2.5 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}
