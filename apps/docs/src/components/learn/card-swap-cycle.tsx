"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Real `advance()`: front item jumps to the back rank in one spring; every
 * other card steps forward one rank. Slot math matches the component
 * (`offsetX: 22`, `offsetY: 28`, `scaleStep: 0.06`, `rotateZ: rank * -2.5`).
 *
 * Previous loop walked ranks 0→1→2→3 then flew 3→0 in one tween — that
 * reverse flight is what looked broken. Path is now: hold front → dive to
 * back → step 3→2→1→0.
 */
const CARDS = 4;
const DURATION_S = 5.6;
const EASE = "cubic-bezier(0.3, 0.7, 0.4, 1)";

// Rank slots — same formula as card-swap.tsx
const S0 = "translate(0px, 0px) scale(1) rotate(0deg)";
const S1 = "translate(22px, -28px) scale(0.94) rotate(-2.5deg)";
const S2 = "translate(44px, -56px) scale(0.88) rotate(-5deg)";
const S3 = "translate(66px, -84px) scale(0.82) rotate(-7.5deg)";

const CSS = `
@keyframes csc-cycle {
  /* rank 0 — front, hold */
  0%, 12%   { transform: ${S0}; z-index: 4; }
  /* dive to rank 3 — the swap */
  22%, 34%  { transform: ${S3}; z-index: 1; }
  /* step forward through the stack */
  44%, 56%  { transform: ${S2}; z-index: 2; }
  66%, 78%  { transform: ${S1}; z-index: 3; }
  /* arrive at front again */
  88%, 100% { transform: ${S0}; z-index: 4; }
}
.csc-plate {
  animation: csc-cycle ${DURATION_S}s ${EASE} infinite;
  animation-delay: var(--delay);
}
.csc-static .csc-plate { animation: none; }
.csc-static .csc-plate:nth-child(1) { transform: ${S0}; z-index: 4; }
.csc-static .csc-plate:nth-child(2) { transform: ${S1}; z-index: 3; }
.csc-static .csc-plate:nth-child(3) { transform: ${S2}; z-index: 2; }
.csc-static .csc-plate:nth-child(4) { transform: ${S3}; z-index: 1; }
`;

function plateStyle(index: number): CSSProperties {
  return {
    "--delay": `${-(index * (DURATION_S / CARDS))}s`,
  } as CSSProperties;
}

export function CardSwapCycle() {
  return (
    <ScrollScene
      label="The swap"
      note="front dives back · the rest step forward"
    >
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[420px] flex-col items-center gap-9">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`relative h-44 w-56 ${reduced ? "csc-static" : ""}`}
          >
            {/* Anchor the stack so +x / −y offsets stay inside the stage. */}
            <div className="absolute top-24 left-4 h-28 w-40">
              {Array.from({ length: CARDS }).map((_, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length stack
                  key={i}
                  className="csc-plate absolute inset-0 rounded-2xl border border-fd-border bg-[var(--card)] shadow-md"
                  style={plateStyle(i)}
                />
              ))}
            </div>
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            setOrder(o =&gt; [...o.slice(1), o[0]])
          </p>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--foreground)]/30 ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Front → back
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                one spring to rank n−1, not a fly-around
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--foreground)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Everyone else
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                rank − 1 · stiffness 320 / damping 32
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
