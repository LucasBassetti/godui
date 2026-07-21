"use client";

import { TextAnimate } from "@godui/components";

/**
 * Closing panel — live TextAnimate instances so the reader feels split
 * granularity, preset motion, and the in-view stagger in one place.
 */
export function TextAnimateResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — scroll, wait, stagger
        </span>
      </div>
      <div className="flex min-h-[280px] flex-col items-center justify-center gap-10 p-10">
        <div className="flex flex-col items-center gap-2">
          <TextAnimate
            animation="blurInUp"
            by="word"
            className="text-center text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Animate your ideas into reality
          </TextAnimate>
          <span className="font-mono text-[11px] text-fd-muted-foreground">
            blurInUp · by word
          </span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <TextAnimate
            animation="slideUp"
            by="character"
            stagger={0.03}
            className="text-center text-2xl font-medium tracking-tight sm:text-3xl"
          >
            Character by character
          </TextAnimate>
          <span className="font-mono text-[11px] text-fd-muted-foreground">
            slideUp · by character
          </span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <TextAnimate
            as="h2"
            animation="scaleUp"
            by="word"
            className="text-center text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Scale up with spring
          </TextAnimate>
          <span className="font-mono text-[11px] text-fd-muted-foreground">
            scaleUp · as h2
          </span>
        </div>
      </div>
    </div>
  );
}
