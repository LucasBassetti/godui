"use client";

import { Ac, Sk } from "./_kit";

export default function TerminalPreview() {
  return (
    <div className="h-24 w-36 overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center gap-1 border-b border-border bg-muted/50 px-2 py-1.5">
        <span className="size-1.5 rounded-full bg-[var(--muted-foreground)]/40" />
        <span className="size-1.5 rounded-full bg-[var(--muted-foreground)]/40" />
        <span className="size-1.5 rounded-full bg-[var(--muted-foreground)]/40" />
      </div>
      <div className="space-y-1.5 p-3">
        <div className="flex items-center gap-1">
          <Ac className="size-1.5 rounded-[1px]" />
          <Ac className="h-1.5 w-6 rounded-full transition-[width] duration-500 group-hover:w-16" />
          <span className="h-2.5 w-[3px] bg-primary opacity-0 group-hover:animate-pulse group-hover:opacity-100" />
        </div>
        <Sk className="h-1.5 w-4/5 rounded-full" />
        <Sk className="h-1.5 w-2/3 rounded-full" />
      </div>
    </div>
  );
}
