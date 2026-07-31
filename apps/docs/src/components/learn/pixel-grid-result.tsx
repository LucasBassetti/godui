"use client";

import { PixelGrid } from "@godui/components";
import { useBareScene } from "@/components/learn/bare-scene-context";

/**
 * The real, interactive Pixel Grid — no card chrome. Rendered on the shared
 * `LearnPlayer` stage as the final chapter.
 */
export function PixelGridResultBody() {
  return (
    <div className="relative min-h-[300px] w-full overflow-hidden md:min-h-[360px]">
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
  );
}

export function PixelGridResult() {
  // On the LearnPlayer stage, the player supplies the card — render the live
  // component only. (Standalone / classic scroll layout keeps its own card.)
  if (useBareScene())
    return (
      <div className="flex min-h-[280px] w-full items-center justify-center p-6">
        <PixelGridResultBody />
      </div>
    );
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
      <PixelGridResultBody />
    </div>
  );
}
