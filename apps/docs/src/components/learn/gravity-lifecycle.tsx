"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * An `IntersectionObserver` (canvas) and a `visibilitychange` listener
 * (document) both gate `resume()`/`pause()`. `pause()` stops the Matter
 * `Runner` *and* cancels the rAF sync loop — a physics world sitting off
 * screen or behind another tab burns zero frames.
 */
const CSS = `
@keyframes grv-jiggle {
  0%, 100% { transform: translateY(0) rotate(-4deg); }
  50%      { transform: translateY(-6px) rotate(3deg); }
}
.grv-run { animation: grv-jiggle 1.4s cubic-bezier(0.3,0.7,0.4,1) infinite; }
.grv-static .grv-run { animation: none; transform: translateY(0) rotate(-4deg); }
`;

export function GravityLifecycle() {
  return (
    <ScrollScene
      label="Cheap when idle"
      note="IntersectionObserver + visibilitychange pause"
    >
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[420px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className={`flex items-center gap-10 ${reduced ? "grv-static" : ""}`}
          >
            <div className="flex flex-col items-center gap-3">
              <span className="font-mono text-[11px] text-fd-muted-foreground">
                in view
              </span>
              <div
                className="grv-run size-14 rounded-[10px] bg-[var(--foreground)]/60"
                style={{ "--d": "0ms" } as CSSProperties}
              />
            </div>
            <div className="flex flex-col items-center gap-3">
              <span className="font-mono text-[11px] text-fd-muted-foreground">
                off-screen / hidden tab
              </span>
              <div className="size-14 rounded-[10px] bg-[var(--foreground)]/25" />
            </div>
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            Runner.stop(runner) · cancelAnimationFrame(syncFrame)
          </p>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--foreground)]/60 ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Running
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                intersecting and tab visible — runner + sync loop active
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--foreground)]/25 ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Paused
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                off-screen or tab hidden — both loops stopped
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
