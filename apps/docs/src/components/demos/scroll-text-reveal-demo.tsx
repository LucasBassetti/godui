"use client";

import { ScrollTextReveal } from "@godui/components";
import { useRef } from "react";
import { DemoScrollPort, DemoScrollRunway } from "@/components/demos/_kit";

export function ScrollTextRevealDemo() {
  // Framed mini-scroller — centered (no Example fullWidth).
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <DemoScrollPort
      ref={scrollRef}
      variant="framed"
      height="26rem"
      max="lg"
      hint="Scroll to reveal"
    >
      <DemoScrollRunway pad="xl" className="max-w-lg px-6">
        <ScrollTextReveal
          container={scrollRef}
          as="p"
          className="text-balance text-center font-semibold text-2xl text-foreground leading-relaxed sm:text-3xl"
        >
          Great interfaces read like a sentence — one idea resolving into the
          next. As you scroll, each word settles into focus, pacing attention
          exactly where it belongs.
        </ScrollTextReveal>
      </DemoScrollRunway>
    </DemoScrollPort>
  );
}

export function ScrollTextRevealKeepDemo() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <DemoScrollPort
      ref={scrollRef}
      variant="framed"
      height="26rem"
      max="lg"
      hint="Scroll to reveal"
    >
      <DemoScrollRunway pad="xl" className="max-w-lg px-6">
        <ScrollTextReveal
          container={scrollRef}
          as="p"
          keepRevealed
          className="text-balance text-center font-semibold text-2xl text-foreground leading-relaxed sm:text-3xl"
        >
          With keepRevealed, each word latches at full presence once it lands —
          so the paragraph stays lit as you scroll back up instead of dimming
          again.
        </ScrollTextReveal>
      </DemoScrollRunway>
    </DemoScrollPort>
  );
}
