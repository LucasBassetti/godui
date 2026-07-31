"use client";

import { Lamp } from "@godui/components";
import { useBareScene } from "@/components/learn/bare-scene-context";

const LampDemo = (
  <Lamp className="w-full min-h-[20rem]">
    <h2 className="bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-2xl font-semibold tracking-tight text-transparent md:text-3xl">
      Build something
      <br />
      the world remembers
    </h2>
  </Lamp>
);

/**
 * Closing panel — the real `Lamp` so the reader feels the whileInView ignite
 * and the delayed children rise together.
 */
export function LampResult() {
  // On the LearnPlayer stage, the player supplies the card — render the live
  // component only. (Standalone / classic scroll layout keeps its own card.)
  if (useBareScene())
    return (
      <div className="flex min-h-[280px] w-full items-center justify-center p-6">
        {LampDemo}
      </div>
    );
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — scroll it into view
        </span>
      </div>
      <div className="flex min-h-[320px] items-center justify-center p-4 md:p-6">
        {LampDemo}
      </div>
    </div>
  );
}
