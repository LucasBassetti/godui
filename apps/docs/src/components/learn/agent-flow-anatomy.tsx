"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Three node cards at absolute (x, y) centers, connected by SVG quadratic
 * curves from each source's right-edge centre to the next target's
 * left-edge centre — the exact anchor rule `Edges` uses. A packet dot sits on
 * the first curve to mark where the travelling beam rides. Grayscale: this
 * scene is about the graph's shape, not the light itself.
 */
const BOX_W = 400;
const BOX_H = 170;

// Node centres (canvas units, matches AgentFlowNode.x/y).
const A = { x: 65, y: 125 };
const B = { x: 200, y: 45 };
const C = { x: 335, y: 115 };
const CARD_W = 116;
const CARD_H = 46;
const HALF_W = CARD_W / 2;

// Right/left edge-centre anchors, same as `Edges`: `from.x + w/2` → `to.x - w/2`.
const edge1 = {
  startX: A.x + HALF_W,
  startY: A.y,
  endX: B.x - HALF_W,
  endY: B.y,
};
const edge2 = {
  startX: B.x + HALF_W,
  startY: B.y,
  endX: C.x - HALF_W,
  endY: C.y,
};
const ctrl1 = {
  x: (edge1.startX + edge1.endX) / 2,
  y: (edge1.startY + edge1.endY) / 2 - 25,
};
const ctrl2 = {
  x: (edge2.startX + edge2.endX) / 2,
  y: (edge2.startY + edge2.endY) / 2 + 20,
};
const path1 = `M ${edge1.startX},${edge1.startY} Q ${ctrl1.x},${ctrl1.y} ${edge1.endX},${edge1.endY}`;
const path2 = `M ${edge2.startX},${edge2.startY} Q ${ctrl2.x},${ctrl2.y} ${edge2.endX},${edge2.endY}`;

// Packet dot parked at t = 0.5 along the first curve's quadratic bezier —
// it simply fades onto the line after the edge draws, no travel, no pulse.
const packet = {
  x: 0.25 * edge1.startX + 0.5 * ctrl1.x + 0.25 * edge1.endX,
  y: 0.25 * edge1.startY + 0.5 * ctrl1.y + 0.25 * edge1.endY,
};

const CSS = `
@keyframes afa-in {
  from { opacity: 0; filter: blur(6px); transform: scale(0.9); }
  to   { opacity: 1; filter: blur(0);   transform: scale(1); }
}
@keyframes afa-edge {
  0%   { opacity: 0; stroke-dashoffset: 1; }
  10%  { opacity: 1; }
  100% { opacity: 1; stroke-dashoffset: 0; }
}
@keyframes afa-fade {
  from { opacity: 0; }
  to   { opacity: 0.85; }
}
.afa-card  { animation: afa-in 420ms cubic-bezier(0.22,1,0.36,1) var(--d) both; opacity: 0; }
.afa-edge  { animation: afa-edge 520ms linear var(--d) both; opacity: 0; }
.afa-packet { animation: afa-fade 320ms ease-out 900ms both; opacity: 0; }
.afa-static .afa-card, .afa-static .afa-edge {
  animation: none; opacity: 1; filter: none; transform: none; stroke-dashoffset: 0;
}
.afa-static .afa-packet { animation: none; opacity: 0.85; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Node card",
    desc: "absolute (x, y) centre, size measured live",
    swatch: "border-2 border-[var(--foreground)]/50 bg-transparent",
  },
  {
    name: "Edge path",
    desc: "quadratic curve, right-centre → left-centre",
    swatch: "bg-[var(--foreground)]/40",
  },
  {
    name: "Packet",
    desc: "gradient beam that rides the curve",
    swatch: "bg-[var(--foreground)]",
  },
];

function Card({ x, y, delay }: { x: number; y: number; delay: string }) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: x, top: y, width: CARD_W, height: CARD_H }}
    >
      <div
        className="afa-card flex h-full w-full items-center gap-2 rounded-xl border border-fd-border bg-[var(--card)] p-2.5 shadow-sm"
        style={{ "--d": delay } as CSSProperties}
      >
        <span className="size-6 shrink-0 rounded-lg border border-fd-border bg-[var(--muted)]" />
        <span className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="h-1.5 w-12 rounded-full bg-[var(--foreground)]/40" />
          <span className="h-1.5 w-8 rounded-full bg-[var(--foreground)]/20" />
        </span>
      </div>
    </div>
  );
}

export function AgentFlowAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="node · edge · packet">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full flex-col items-center gap-8 ${reduced ? "afa-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            className="relative max-w-full"
            style={{ width: BOX_W, height: BOX_H }}
          >
            <svg
              aria-hidden="true"
              viewBox={`0 0 ${BOX_W} ${BOX_H}`}
              fill="none"
              className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            >
              <path
                d={path1}
                className="afa-edge"
                stroke="var(--foreground)"
                strokeOpacity={0.4}
                strokeWidth={2}
                strokeLinecap="round"
                pathLength={1}
                style={{ strokeDasharray: 1, "--d": "360ms" } as CSSProperties}
              />
              <path
                d={path2}
                className="afa-edge"
                stroke="var(--foreground)"
                strokeOpacity={0.4}
                strokeWidth={2}
                strokeLinecap="round"
                pathLength={1}
                style={{ strokeDasharray: 1, "--d": "480ms" } as CSSProperties}
              />
              <circle
                className="afa-packet"
                cx={packet.x}
                cy={packet.y}
                r={4.5}
                fill="var(--foreground)"
              />
            </svg>

            <Card x={A.x} y={A.y} delay="0ms" />
            <Card x={B.x} y={B.y} delay="120ms" />
            <Card x={C.x} y={C.y} delay="240ms" />
          </div>

          <dl className="grid w-full max-w-[400px] grid-cols-3 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <span
                  className={`h-1.5 w-8 rounded-full ${item.swatch} ring-1 ring-fd-border ring-inset`}
                />
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
