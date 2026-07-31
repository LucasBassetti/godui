"use client";

import { FlowField } from "@godui/components";
import { useBareScene } from "@/components/learn/bare-scene-context";

export function FlowFieldResult() {
  const demo = (
    <div className="relative min-h-[320px] w-full overflow-hidden md:min-h-[380px]">
      <FlowField speed={1} fade={0.06} noiseScale={0.0016} />
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
          the real component — calm field
        </span>
      </div>
      {demo}
    </div>
  );
}
