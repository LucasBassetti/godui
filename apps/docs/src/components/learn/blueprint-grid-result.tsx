"use client";

import { BlueprintGrid } from "@godui/components";
import { useBareScene } from "@/components/learn/bare-scene-context";

export function BlueprintGridResult() {
  const demo = (
    <div className="relative w-full min-h-[300px] overflow-hidden md:min-h-[360px]">
      <BlueprintGrid
        variant="lines"
        cellSize={32}
        sweep
        spotlight
        sweepDuration={8}
      />
      <div className="pointer-events-none relative z-raised flex min-h-[300px] items-center justify-center md:min-h-[360px]">
        <div className="h-2.5 w-28 rounded-full bg-[var(--foreground)]/25" />
      </div>
    </div>
  );

  // On the LearnPlayer stage, the player supplies the card — render the live
  // component only. (Standalone / classic scroll layout keeps its own card.)
  if (useBareScene())
    return (
      <div className="flex min-h-[280px] w-full items-center justify-center p-6">
        {demo}
      </div>
    );

  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — move for spotlight
        </span>
      </div>
      {demo}
    </div>
  );
}
