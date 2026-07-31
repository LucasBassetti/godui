"use client";

import { ImageTrailDemo } from "@/components/demos/image-trail-demo";
import { useBareScene } from "@/components/learn/bare-scene-context";

/**
 * Closing panel — the real `ImageTrail`. Move across the stage to spawn
 * recycled images; reduced-motion users see the static five-image gallery.
 */
export function ImageTrailResult() {
  // On the LearnPlayer stage, the player supplies the card — render the live
  // component only. (Standalone / classic scroll layout keeps its own card.)
  if (useBareScene())
    return (
      <div className="flex min-h-[280px] w-full items-center justify-center p-6">
        <ImageTrailDemo />
      </div>
    );
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — move to leave a trail
        </span>
      </div>
      <div className="min-h-[320px]">
        <ImageTrailDemo />
      </div>
    </div>
  );
}
