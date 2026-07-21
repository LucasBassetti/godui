"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Reproduces the real path formula for a container-relative `from`/`to` pair:
 * `M startX,startY Q controlX,controlY endX,endY`, where the control point
 * sits at the horizontal midpoint and is pushed up by `curvature`. Numbers
 * below are this scene's own 320×140 stage, not literal component output.
 */
const FROM = { x: 48, y: 70 };
const TO = { x: 272, y: 70 };
const CURVATURE = 40;
const CTRL = {
  x: (FROM.x + TO.x) / 2,
  y: (FROM.y + TO.y) / 2 - CURVATURE,
};
const PATH = `M ${FROM.x},${FROM.y} Q ${CTRL.x},${CTRL.y} ${TO.x},${TO.y}`;

const CSS = `
@keyframes aba-node {
  from { opacity: 0; transform: scale(0.8); }
  to   { opacity: 1; transform: scale(1); }
}
.aba-node { animation: aba-node 500ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }

@keyframes aba-draw {
  from { stroke-dashoffset: 1; opacity: 0; }
  to   { stroke-dashoffset: 0; opacity: 1; }
}
.aba-path { animation: aba-draw 700ms cubic-bezier(0.3,0.7,0.4,1) 260ms both; }

.aba-static .aba-node { animation: none; opacity: 1; transform: none; }
.aba-static .aba-path { animation: none; stroke-dashoffset: 0; opacity: 1; }
`;

const LEGEND = [
  {
    name: "From",
    desc: "fromRef center, +startXOffset/startYOffset",
    kind: "from",
  },
  {
    name: "To",
    desc: "toRef center, +endXOffset/endYOffset",
    kind: "to",
  },
  {
    name: "Path",
    desc: "M start Q (mid, mid − curvature) end",
    kind: "path",
  },
] as const;

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "from") {
    return (
      <span className="size-3 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
    );
  }
  if (kind === "to") {
    return (
      <span className="size-3 rounded-full border border-fd-border bg-[var(--card)] ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="h-0.5 w-8 rounded-full bg-[var(--foreground)]/55 ring-1 ring-fd-border ring-inset" />
  );
}

export function AnimatedBeamAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="from · to · quadratic path">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[420px] flex-col items-center gap-9 ${reduced ? "aba-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="relative" style={{ width: 320, height: 140 }}>
            <svg
              aria-hidden="true"
              width={320}
              height={140}
              viewBox="0 0 320 140"
              fill="none"
              className="pointer-events-none absolute inset-0 overflow-visible"
            >
              <path
                className="aba-path"
                d={PATH}
                stroke="var(--foreground)"
                strokeOpacity={0.55}
                strokeWidth={2}
                strokeLinecap="round"
                pathLength={1}
                style={{ strokeDasharray: 1 }}
              />
            </svg>

            <div
              className="aba-node absolute rounded-full bg-[var(--muted)] shadow-sm"
              style={
                {
                  left: FROM.x - 22,
                  top: FROM.y - 22,
                  width: 44,
                  height: 44,
                  "--d": "0ms",
                } as CSSProperties
              }
            />
            <div
              className="aba-node absolute flex items-center justify-center rounded-full border border-fd-border bg-[var(--card)] shadow-md"
              style={
                {
                  left: TO.x - 26,
                  top: TO.y - 26,
                  width: 52,
                  height: 52,
                  "--d": "120ms",
                } as CSSProperties
              }
            >
              <span className="h-2 w-6 rounded-full bg-[var(--foreground)]/30" />
            </div>
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
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
