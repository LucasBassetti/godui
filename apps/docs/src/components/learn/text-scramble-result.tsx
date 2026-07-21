"use client";

import { TextScramble } from "@godui/components";

/**
 * Closing panel — the real TextScramble. Hover re-runs the scramble so the
 * reader can feel the cell queue, primary unresolved tint, and resolve lock.
 */
export function TextScrambleResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — hover to re-scramble
        </span>
      </div>
      <div className="flex min-h-[240px] flex-col items-center justify-center gap-8 p-10">
        <TextScramble
          text="Decrypting…"
          trigger="hover"
          charset="symbols"
          className="cursor-default font-mono text-4xl font-semibold tracking-tight sm:text-5xl"
        />
        <TextScramble
          text="01001000"
          trigger="hover"
          charset="binary"
          className="cursor-default font-mono text-2xl text-fd-muted-foreground tabular-nums sm:text-3xl"
        />
      </div>
    </div>
  );
}
