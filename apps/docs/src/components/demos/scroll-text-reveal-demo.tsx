"use client";

import { ScrollTextReveal } from "@godui/components";

export function ScrollTextRevealDemo() {
  return (
    <div className="mx-auto max-w-lg px-6 py-10">
      <ScrollTextReveal
        as="p"
        className="text-balance text-center text-2xl font-semibold leading-relaxed text-foreground sm:text-3xl"
      >
        Great interfaces read like a sentence — one idea resolving into the
        next. As you scroll, each word settles into focus, pacing attention
        exactly where it belongs.
      </ScrollTextReveal>
    </div>
  );
}

export function ScrollTextRevealKeepDemo() {
  return (
    <div className="mx-auto max-w-lg px-6 py-10">
      <ScrollTextReveal
        as="p"
        keepRevealed
        className="text-balance text-center text-2xl font-semibold leading-relaxed text-foreground sm:text-3xl"
      >
        With keepRevealed, each word latches at full presence once it lands — so
        the paragraph stays lit as you scroll back up instead of dimming again.
      </ScrollTextReveal>
    </div>
  );
}
