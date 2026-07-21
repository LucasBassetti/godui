"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Real bury: each card stays sticky at `pinTop` with `transformOrigin:
 * "center top"`. `useTransform(progress, [0, segmentEnd, 1], …)` keeps
 * scale/filter flat until that card's own segment ends, then eases toward
 * its depth target. For a 3-card stack at progress → 1:
 *   index 0 (depth 2): scale 0.86, brightness 0.84, blur 4px
 *   index 1 (depth 1): scale 0.93, brightness 0.92, blur 2px
 *   index 2 (depth 0): scale 1, untouched
 * Peek (`translateY: index * 16`) is constant — only scale/filter scrub.
 */
const DURATION = "5.2s";
const EASE = "cubic-bezier(0.45, 0, 0.55, 1)";
const PEEK = 14;

const CSS = `
@keyframes ssb-progress {
  /* hold at rest — all cards still at scale 1 (before any segmentEnd) */
  0%, 14%   { transform: scaleX(0); }
  /* past card 0's segment (~1/3) — first card starts burying */
  38%       { transform: scaleX(0.4); }
  /* past card 1's segment (~2/3) */
  62%       { transform: scaleX(0.72); }
  /* fully buried */
  86%, 100% { transform: scaleX(1); }
}
/* Back card — depth 2: flat until ~segmentEnd, then → 0.86 / 0.84 / 4px */
@keyframes ssb-back {
  0%, 14%   { transform: translateY(0) scale(1); filter: brightness(1) blur(0px); }
  38%       { transform: translateY(0) scale(0.96); filter: brightness(0.96) blur(1px); }
  62%       { transform: translateY(0) scale(0.9); filter: brightness(0.88) blur(2.5px); }
  86%, 100% { transform: translateY(0) scale(0.86); filter: brightness(0.84) blur(4px); }
}
/* Mid card — depth 1: stays flat longer, then → 0.93 / 0.92 / 2px */
@keyframes ssb-mid {
  0%, 38%   { transform: translateY(${PEEK}px) scale(1); filter: brightness(1) blur(0px); }
  62%       { transform: translateY(${PEEK}px) scale(0.97); filter: brightness(0.96) blur(0.8px); }
  86%, 100% { transform: translateY(${PEEK}px) scale(0.93); filter: brightness(0.92) blur(2px); }
}
/* Front card — depth 0: never buries; only peeks */
@keyframes ssb-front {
  0%, 100%  { transform: translateY(${PEEK * 2}px) scale(1); filter: brightness(1) blur(0px); }
}
.ssb-progress {
  animation: ssb-progress ${DURATION} ${EASE} infinite alternate;
}
.ssb-back {
  transform-origin: center top;
  animation: ssb-back ${DURATION} ${EASE} infinite alternate;
}
.ssb-mid {
  transform-origin: center top;
  animation: ssb-mid ${DURATION} ${EASE} infinite alternate;
}
.ssb-front {
  transform-origin: center top;
  animation: ssb-front ${DURATION} ${EASE} infinite alternate;
}
.ssb-static .ssb-progress { animation: none; transform: scaleX(1); }
.ssb-static .ssb-back {
  animation: none;
  transform: scale(0.86);
  filter: brightness(0.84) blur(4px);
}
.ssb-static .ssb-mid {
  animation: none;
  transform: translateY(${PEEK}px) scale(0.93);
  filter: brightness(0.92) blur(2px);
}
.ssb-static .ssb-front {
  animation: none;
  transform: translateY(${PEEK * 2}px) scale(1);
  filter: none;
}
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Back (depth 2)",
    desc: "scale 0.86 · brightness 0.84 · blur 4px",
    swatch: "bg-[var(--muted)]",
  },
  {
    name: "Mid (depth 1)",
    desc: "scale 0.93 · brightness 0.92 · blur 2px",
    swatch: "bg-[var(--foreground)]/25",
  },
  {
    name: "Front (depth 0)",
    desc: "stays at scale 1 — never buries",
    swatch: "bg-[var(--card)] ring-1 ring-fd-border ring-inset",
  },
];

export function ScrollStackBury() {
  return (
    <ScrollScene label="The bury" note="origin top · flat until segmentEnd">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[420px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className={`flex w-full flex-col items-center gap-7 ${reduced ? "ssb-static" : ""}`}
          >
            {/* Stack pinned from the top — same origin as the real component. */}
            <div
              className="relative w-full"
              style={{ height: 128 + PEEK * 2 } as CSSProperties}
            >
              <div className="ssb-back absolute inset-x-0 top-0 mx-auto flex h-24 w-44 items-center justify-center rounded-xl border border-fd-border bg-[var(--muted)] shadow-md">
                <span className="h-1.5 w-12 rounded-full bg-[var(--foreground)]/25" />
              </div>
              <div className="ssb-mid absolute inset-x-0 top-0 mx-auto flex h-24 w-48 items-center justify-center rounded-xl border border-fd-border bg-[var(--card)] shadow-md">
                <span className="h-1.5 w-14 rounded-full bg-[var(--foreground)]/30" />
              </div>
              <div className="ssb-front absolute inset-x-0 top-0 mx-auto flex h-24 w-52 items-center justify-center rounded-xl border border-fd-border bg-[var(--card)] shadow-lg">
                <span className="h-2 w-16 rounded-full bg-[var(--foreground)]/45" />
              </div>
            </div>

            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-[var(--muted)]">
              <span className="ssb-progress absolute inset-y-0 left-0 w-full origin-left rounded-full bg-[var(--foreground)]/60" />
            </div>
            <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
              useTransform(progress, [0, segmentEnd, 1], …)
            </p>
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <span className={`h-1.5 w-8 rounded-full ${item.swatch}`} />
                <dt className="font-medium text-[13px] text-fd-foreground">
                  {item.name}
                </dt>
                <dd className="text-[12px] text-fd-muted-foreground">
                  {item.desc}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
