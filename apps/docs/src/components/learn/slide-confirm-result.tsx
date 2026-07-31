"use client";

import { SlideConfirmButton } from "@godui/components";
import { useBareScene } from "@/components/learn/bare-scene-context";

/**
 * The real, interactive Slide Confirm buttons — no card chrome. Rendered on
 * the shared `LearnPlayer` stage as the final chapter, and reused inside the
 * classic card layout below.
 */
function SlideConfirmDemo() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <SlideConfirmButton label="Slide to deploy" />
      <SlideConfirmButton variant="destructive" label="Slide to delete" />
    </div>
  );
}

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * component so the reader can feel every mechanism the article just pulled
 * apart: drag the thumb, watch the fill trail it, release past the line.
 */
export function SlideConfirmResult() {
  // On the LearnPlayer stage, the player supplies the card — render the live
  // component only. (Standalone / classic scroll layout keeps its own card.)
  if (useBareScene())
    return (
      <div className="flex min-h-[280px] w-full items-center justify-center p-6">
        <SlideConfirmDemo />
      </div>
    );
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — drag the thumb, or release early
        </span>
      </div>
      <div className="flex min-h-[240px] items-center justify-center p-10">
        <SlideConfirmDemo />
      </div>
    </div>
  );
}
