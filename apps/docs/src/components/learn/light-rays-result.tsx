"use client";

import { LightRays } from "@godui/components";
import { useBareScene } from "@/components/learn/bare-scene-context";

/**
 * The live LightRays demo — no card chrome. Rendered on the shared
 * `LearnPlayer` stage as the final chapter, and reused inside the full card
 * return below.
 */
function LightRaysResultBody() {
  return (
    <div className="relative min-h-[340px] w-full overflow-hidden bg-[var(--background)] md:min-h-[400px]">
      <LightRays
        rayCount={14}
        intensity={0.65}
        angle={0}
        speed={1}
        grain={0.12}
      />
      <div className="relative z-raised flex min-h-[340px] flex-col items-center justify-center gap-3 md:min-h-[400px]">
        <div className="h-3 w-36 rounded-full bg-[var(--foreground)]/35" />
        <div className="h-2 w-48 rounded-full bg-[var(--foreground)]/18" />
      </div>
    </div>
  );
}

/**
 * Live LightRays with a slightly stronger grain so the film layer from the
 * article is actually visible in the Result panel.
 */
export function LightRaysResult() {
  // On the LearnPlayer stage, the player supplies the card — render the live
  // component only. (Standalone / classic scroll layout keeps its own card.)
  if (useBareScene())
    return (
      <div className="flex min-h-[280px] w-full items-center justify-center p-6">
        <LightRaysResultBody />
      </div>
    );
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — watch the fan breathe
        </span>
      </div>
      <LightRaysResultBody />
    </div>
  );
}
