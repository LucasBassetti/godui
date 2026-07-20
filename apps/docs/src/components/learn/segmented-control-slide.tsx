"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * `layoutId` binds the pill to whichever tab is active — when the active
 * index changes, framer diffs the pill's old and new box and springs between
 * them instead of cross-fading. Faked here as a looping `translateX` sweep
 * across three equal-width segments flush in the track (no gap — matches
 * the real component).
 */
const SEGMENTS = 3;
const SEGMENT_W = 96; // w-24

const CSS = `
@keyframes scs-slide {
  0%, 20%   { transform: translateX(0); }
  40%, 60%  { transform: translateX(${SEGMENT_W}px); }
  80%, 100% { transform: translateX(${SEGMENT_W * 2}px); }
}
.scs-pill { animation: scs-slide 3.6s cubic-bezier(0.34,1.4,0.64,1) infinite; }
.scs-static .scs-pill { animation: none; transform: none; }
`;

const BARS = ["w-10", "w-14", "w-9"];

export function SegmentedControlSlide() {
  return (
    <ScrollScene label="The motion" note="one pill · layoutId spring">
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[460px] flex-col items-center gap-9 ${reduced ? "scs-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className="relative inline-flex h-10 items-stretch rounded-lg border border-fd-border bg-[var(--muted)] p-1"
          >
            <span
              aria-hidden="true"
              className="scs-pill pointer-events-none absolute top-1 left-1 h-8 w-24 rounded-md bg-[var(--background)] shadow-sm ring-1 ring-fd-border"
            />
            {Array.from({ length: SEGMENTS }).map((_, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length segment row
                key={i}
                className="relative z-10 flex w-24 items-center justify-center px-3"
              >
                <span
                  className={`h-2 ${BARS[i]} rounded-full bg-[var(--foreground)]/30`}
                />
              </div>
            ))}
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            layoutId spring — stiffness 520, damping 32
          </p>
        </div>
      )}
    </ScrollScene>
  );
}
