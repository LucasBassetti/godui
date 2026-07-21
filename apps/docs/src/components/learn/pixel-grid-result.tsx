"use client";

import { PixelGrid } from "@godui/components";

export function PixelGridResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — move to reveal
        </span>
      </div>
      <div className="relative min-h-[300px] overflow-hidden md:min-h-[360px]">
        <PixelGrid
          interactive
          cursorReveal="hidden"
          squareSize={4}
          gridGap={6}
          flickerChance={0.3}
          maxOpacity={0.3}
          interactionRadius={120}
        />
        <div className="pointer-events-none relative z-raised flex min-h-[300px] items-center justify-center md:min-h-[360px]">
          <div className="h-2.5 w-32 rounded-full bg-[var(--foreground)]/30" />
        </div>
      </div>
    </div>
  );
}
