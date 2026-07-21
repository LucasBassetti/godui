"use client";

import { ScrollTextReveal } from "@godui/components";

/**
 * Closing panel — the real ScrollTextReveal. useScroll targets the element
 * against the document viewport (no container prop), so this panel leaves
 * vertical room and asks the reader to scroll the page through it.
 */
export function ScrollTextRevealResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — scroll the page
        </span>
      </div>
      <div className="mx-auto flex max-w-lg flex-col gap-16 px-6 py-20 md:py-28">
        <ScrollTextReveal
          as="p"
          className="text-balance text-center text-2xl font-semibold leading-relaxed text-foreground sm:text-3xl"
        >
          Great interfaces read like a sentence — one idea resolving into the
          next. As you scroll, each word settles into focus, pacing attention
          exactly where it belongs.
        </ScrollTextReveal>
        <ScrollTextReveal
          as="p"
          keepRevealed
          className="text-balance text-center text-xl font-semibold leading-relaxed text-foreground sm:text-2xl"
        >
          With keepRevealed, each word latches at full presence once it lands —
          so the paragraph stays lit as you scroll back up instead of dimming
          again.
        </ScrollTextReveal>
      </div>
    </div>
  );
}
