"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Auto-advance, visualized: `activeIndex = min(value.length, length − 1)`. One
 * traveling highlight (ring + blinking caret) glides cell to cell as they fill,
 * and each cell reveals its dot right as the caret passes. Pure display — the
 * value moves, the highlight follows it. One-shot on scroll-in; replay re-runs.
 */
const CELLS = 6;
const PITCH = 56; // 48px cell + 8px gap

const CSS = `
@keyframes oc-caret {
  0%   { transform: translateX(0); opacity: 0; }
  6%   { opacity: 1; }
  88%  { transform: translateX(${(CELLS - 1) * PITCH}px); opacity: 1; }
  100% { transform: translateX(${(CELLS - 1) * PITCH}px); opacity: 0; }
}
@keyframes oc-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
@keyframes oc-dot {
  from { opacity: 0; transform: translateY(4px) scale(0.6); }
  to   { opacity: 1; transform: none; }
}
.oc-caret { animation: oc-caret 2.8s cubic-bezier(0.4,0,0.2,1) both; }
.oc-blink { animation: oc-blink 1s steps(2, jump-none) infinite; }
.oc-dot   { opacity: 0; animation: oc-dot 220ms ease var(--d) both; }
.oc-static .oc-caret { animation: none; opacity: 0; }
.oc-static .oc-blink { animation: none; }
.oc-static .oc-dot   { opacity: 1; animation: none; transform: none; }
`;

export function OtpCaret() {
  return (
    <ScrollScene
      label="Traveling caret"
      note="the highlight follows activeIndex"
    >
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[440px] flex-col items-center gap-9 ${reduced ? "oc-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div className="relative flex items-center gap-2">
            {Array.from({ length: CELLS }).map((_, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length cell grid
                key={i}
                className="flex size-12 items-center justify-center rounded-lg border border-border bg-[var(--card)]"
              >
                <span
                  className="oc-dot size-2.5 rounded-full bg-foreground"
                  style={{ "--d": `${350 + i * 440}ms` } as CSSProperties}
                />
              </div>
            ))}

            {/* Traveling highlight — the active cell: ring + blinking caret. */}
            <div className="oc-caret pointer-events-none absolute top-0 left-0 flex size-12 items-center justify-center rounded-lg ring-2 ring-ring">
              <span className="oc-blink h-6 w-px rounded-full bg-foreground" />
            </div>
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            sanitize() slices to length; onComplete fires when the last cell
            fills
          </p>
        </div>
      )}
    </ScrollScene>
  );
}
