"use client";

import { ShimmerButton } from "@godui/components";
import { useBareScene } from "@/components/learn/bare-scene-context";

const ShimmerResultBody = () => (
  <>
    <ShimmerButton variant="primary">Primary</ShimmerButton>
    <ShimmerButton variant="secondary">Secondary</ShimmerButton>
    <ShimmerButton variant="outline">Outline</ShimmerButton>
  </>
);

/**
 * Closing "here's the finished thing" panel — the real, interactive Shimmer
 * Button so the reader can feel every mechanism the article just pulled
 * apart: hover/focus speed-up, the press dip, the border-only spark.
 */
export function ShimmerResult() {
  // On the LearnPlayer stage, the player supplies the card — render the live
  // component only. (Standalone / classic scroll layout keeps its own card.)
  if (useBareScene())
    return (
      <div className="flex min-h-[280px] w-full flex-wrap items-center justify-center gap-6 p-6">
        <ShimmerResultBody />
      </div>
    );
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — hover, focus, press
        </span>
      </div>
      <div className="flex min-h-[240px] flex-wrap items-center justify-center gap-6 p-10">
        <ShimmerResultBody />
      </div>
    </div>
  );
}
