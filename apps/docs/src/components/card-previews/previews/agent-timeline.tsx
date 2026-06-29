"use client";

import { Sk } from "./_kit";

export default function AgentTimelinePreview() {
  return (
    <div className="w-44 space-y-3">
      <div className="flex items-center gap-3">
        <span className="size-4 shrink-0 rounded-full bg-primary" />
        <Sk className="h-2 w-28 rounded-full" />
      </div>
      <div className="flex items-center gap-3">
        <span className="size-4 shrink-0 rounded-full bg-[var(--muted-foreground)]/25 transition-colors duration-300 group-hover:bg-primary" />
        <Sk className="h-2 w-24 rounded-full" />
      </div>
      <div className="flex items-center gap-3">
        <span className="size-4 shrink-0 rounded-full bg-[var(--muted-foreground)]/25" />
        <Sk className="h-2 w-20 rounded-full" />
      </div>
    </div>
  );
}
