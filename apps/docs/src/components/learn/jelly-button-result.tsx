"use client";

import { JellyButton } from "@godui/components";
import { useBareScene } from "@/components/learn/bare-scene-context";

/**
 * The real, interactive Jelly Buttons — no card chrome. Reused on the shared
 * `LearnPlayer` stage and inside the classic result card.
 */
function JellyButtonResultBody() {
  return (
    <>
      <JellyButton variant="primary">Press me</JellyButton>
      <JellyButton variant="secondary">Press me</JellyButton>
      <JellyButton variant="outline">Press me</JellyButton>
    </>
  );
}

/**
 * Closing "here's the finished thing" panel — the real, interactive Jelly
 * Button so the reader can feel the squash-and-stretch every mechanism above
 * pulled apart.
 */
export function JellyButtonResult() {
  // On the LearnPlayer stage, the player supplies the card — render the live
  // component only. (Standalone / classic scroll layout keeps its own card.)
  if (useBareScene())
    return (
      <div className="flex min-h-[280px] w-full flex-wrap items-center justify-center gap-6 p-6">
        <JellyButtonResultBody />
      </div>
    );
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — hover, focus, press and hold
        </span>
      </div>
      <div className="flex min-h-[240px] flex-wrap items-center justify-center gap-6 p-10">
        <JellyButtonResultBody />
      </div>
    </div>
  );
}
