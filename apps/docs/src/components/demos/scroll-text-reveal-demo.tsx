"use client";

import { ScrollTextReveal } from "@godui/components";
import { useRef } from "react";

export function ScrollTextRevealDemo() {
  // The preview stage is an inner scroll area, so the reveal tracks this
  // container (not the window). Vertical runway lets each word scrub into focus.
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={scrollRef} className="h-[26rem] w-full overflow-y-auto">
      <div className="mx-auto max-w-lg px-6 py-[55vh]">
        <ScrollTextReveal
          container={scrollRef}
          as="p"
          className="text-balance text-center text-2xl font-semibold leading-relaxed text-foreground sm:text-3xl"
        >
          Great interfaces read like a sentence — one idea resolving into the
          next. As you scroll, each word settles into focus, pacing attention
          exactly where it belongs.
        </ScrollTextReveal>
      </div>
    </div>
  );
}

export function ScrollTextRevealKeepDemo() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={scrollRef} className="h-[26rem] w-full overflow-y-auto">
      <div className="mx-auto max-w-lg px-6 py-[55vh]">
        <ScrollTextReveal
          container={scrollRef}
          as="p"
          keepRevealed
          className="text-balance text-center text-2xl font-semibold leading-relaxed text-foreground sm:text-3xl"
        >
          With keepRevealed, each word latches at full presence once it lands —
          so the paragraph stays lit as you scroll back up instead of dimming
          again.
        </ScrollTextReveal>
      </div>
    </div>
  );
}
