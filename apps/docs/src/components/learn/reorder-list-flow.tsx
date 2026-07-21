"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Real Reorder: the dragged row follows the pointer; the moment it crosses a
 * neighbour's midpoint, Motion swaps `values` and every other item springs
 * into the vacated slot under `REORDER_SPRING` (stiffness 520 / damping 32)
 * — snappy, almost no overshoot. Absolute slots here so the neighbour can
 * slide into the gap without flex leaving a hollow row behind.
 */
const ROW = 48; // visual row height
const GAP = 8;
const STEP = ROW + GAP;

// Snappy settle — mirrors high stiffness / moderate damping, not a bounce.
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const DURATION = "4.8s";

const CSS = `
@keyframes rlf-dragged {
  /* rest in slot 1 */
  0%, 12%   { transform: translateY(0) scale(1); }
  /* lift */
  18%       { transform: translateY(0) scale(1.03); }
  /* cross into slot 2 */
  38%, 50%  { transform: translateY(${STEP}px) scale(1.03); }
  /* drop in slot 2 */
  56%       { transform: translateY(${STEP}px) scale(1); }
  /* lift again */
  62%       { transform: translateY(${STEP}px) scale(1.03); }
  /* drag back into slot 1 */
  82%, 88%  { transform: translateY(0) scale(1.03); }
  /* drop */
  94%, 100% { transform: translateY(0) scale(1); }
}
@keyframes rlf-neighbor {
  /* rest in slot 2 */
  0%, 18%   { transform: translateY(0); }
  /* flow up into vacated slot 1 */
  38%, 62%  { transform: translateY(-${STEP}px); }
  /* flow back down into slot 2 */
  82%, 100% { transform: translateY(0); }
}
@keyframes rlf-shadow {
  0%, 12%   { opacity: 0; }
  18%, 52%  { opacity: 1; }
  56%, 60%  { opacity: 0; }
  62%, 90%  { opacity: 1; }
  94%, 100% { opacity: 0; }
}
@keyframes rlf-z {
  0%, 12%   { z-index: 1; }
  18%, 56%  { z-index: 5; }
  57%, 60%  { z-index: 1; }
  62%, 94%  { z-index: 5; }
  95%, 100% { z-index: 1; }
}
.rlf-dragged {
  animation:
    rlf-dragged ${DURATION} ${EASE} infinite,
    rlf-z ${DURATION} linear infinite;
}
.rlf-neighbor { animation: rlf-neighbor ${DURATION} ${EASE} infinite; }
.rlf-shadow { animation: rlf-shadow ${DURATION} ease infinite; }
.rlf-static .rlf-dragged,
.rlf-static .rlf-neighbor { animation: none; transform: none; }
.rlf-static .rlf-shadow { animation: none; opacity: 0; }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "lift" | "item";
}[] = [
  {
    name: "Dragged",
    desc: "follows the pointer, lift via data-dragging",
    kind: "lift",
  },
  {
    name: "Neighbor",
    desc: "springs into the vacated slot — same REORDER_SPRING",
    kind: "item",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "lift") {
    return (
      <span className="h-2.5 w-8 scale-[1.03] rounded-lg border border-border bg-[var(--card)] shadow-lg ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="h-2.5 w-8 rounded-lg border border-border bg-[var(--card)] ring-1 ring-fd-border ring-inset" />
  );
}

function Row({
  className,
  bar,
  shadow,
}: {
  className?: string;
  bar: string;
  shadow?: boolean;
}) {
  return (
    <div
      className={`absolute inset-x-0 flex items-center gap-3 rounded-lg border border-border bg-[var(--card)] px-3 shadow-sm ${className ?? ""}`}
      style={{ height: ROW } as CSSProperties}
    >
      {shadow ? (
        <span
          aria-hidden
          className="rlf-shadow pointer-events-none absolute inset-0 rounded-lg opacity-0 shadow-xl"
        />
      ) : null}
      <span
        aria-hidden
        className="text-[var(--foreground)]/30 text-sm leading-none"
      >
        ⠿
      </span>
      <span className={`h-1.5 rounded-full ${bar}`} />
    </div>
  );
}

export function ReorderListFlow() {
  const stageH = STEP * 4 - GAP;

  return (
    <ScrollScene label="Neighbor flow" note="stiffness 520 · damping 32">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[340px] flex-col items-center gap-8 ${reduced ? "rlf-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            className="relative w-full rounded-2xl border border-dashed border-border p-2.5"
            style={{ height: stageH + 20 } as CSSProperties}
          >
            <div className="relative w-full" style={{ height: stageH }}>
              {/* Slot 0 — stays put */}
              <div className="absolute inset-x-0" style={{ top: 0 }}>
                <Row bar="w-20 bg-[var(--foreground)]/20" />
              </div>

              {/* Slot 1 — dragged down into slot 2 */}
              <div className="absolute inset-x-0" style={{ top: STEP }}>
                <Row
                  className="rlf-dragged"
                  bar="w-24 bg-[var(--foreground)]/50"
                  shadow
                />
              </div>

              {/* Slot 2 — neighbor flows up into vacated slot 1 */}
              <div className="absolute inset-x-0" style={{ top: STEP * 2 }}>
                <Row
                  className="rlf-neighbor"
                  bar="w-16 bg-[var(--foreground)]/20"
                />
              </div>

              {/* Slot 3 — stays put */}
              <div className="absolute inset-x-0" style={{ top: STEP * 3 }}>
                <Row bar="w-28 bg-[var(--foreground)]/20" />
              </div>
            </div>
          </div>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <LegendSwatch kind={item.kind} />
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
