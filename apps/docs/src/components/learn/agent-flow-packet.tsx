"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Two nodes, one continuous light: card A traces its border, its icon lights
 * at the halfway point, then a packet sweeps the curved edge to card B —
 * which starts tracing the instant the packet lands. That handoff (border →
 * beam → border) is `autoPlay`'s whole choreography, reduced to one hop.
 * Percentages below are this scene's own clock, not literal `flowSpeed`
 * output — chosen so the eye can track trace → light → flow → trace again.
 */
const CARD_W = 116;
const CARD_H = 46;
const R = 12;
const CARD_TOP = `M 0,${CARD_H / 2} L 0,${R} A ${R},${R} 0 0 1 ${R},0 L ${CARD_W - R},0 A ${R},${R} 0 0 1 ${CARD_W},${R} L ${CARD_W},${CARD_H / 2}`;
const CARD_BOTTOM = `M 0,${CARD_H / 2} L 0,${CARD_H - R} A ${R},${R} 0 0 0 ${R},${CARD_H} L ${CARD_W - R},${CARD_H} A ${R},${R} 0 0 0 ${CARD_W},${CARD_H - R} L ${CARD_W},${CARD_H / 2}`;

// Node centres and the edge's chord + quadratic control point, same anchor
// rule as `Edges`: right-edge centre of A → left-edge centre of B.
const A = { x: 68, y: 96 };
const B = { x: 292, y: 40 };
const half = CARD_W / 2;
const start = { x: A.x + half, y: A.y };
const end = { x: B.x - half, y: B.y };
const ctrl = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 - 40 };
const edgePath = `M ${start.x},${start.y} Q ${ctrl.x},${ctrl.y} ${end.x},${end.y}`;

const CSS = `
@keyframes pk-a-border {
  0%, 1%     { opacity: 0; stroke-dashoffset: 1; }
  2%         { opacity: 1; }
  18%        { stroke-dashoffset: 0; opacity: 1; }
  84%        { stroke-dashoffset: 0; opacity: 1; }
  92%, 100%  { opacity: 0; stroke-dashoffset: 1; }
}
@keyframes pk-a-icon {
  0%, 9%     { transform: scale(0.55); opacity: 0.35; }
  10%        { transform: scale(1.18); opacity: 1; }
  14%        { transform: scale(1); opacity: 1; }
  84%        { transform: scale(1); opacity: 1; }
  92%, 100%  { transform: scale(0.55); opacity: 0.35; }
}
@keyframes pk-b-border {
  0%, 45%    { opacity: 0; stroke-dashoffset: 1; }
  46%        { opacity: 1; }
  62%        { stroke-dashoffset: 0; opacity: 1; }
  84%        { stroke-dashoffset: 0; opacity: 1; }
  92%, 100%  { opacity: 0; stroke-dashoffset: 1; }
}
@keyframes pk-b-icon {
  0%, 53%    { transform: scale(0.55); opacity: 0.35; }
  54%        { transform: scale(1.18); opacity: 1; }
  58%        { transform: scale(1); opacity: 1; }
  84%        { transform: scale(1); opacity: 1; }
  92%, 100%  { transform: scale(0.55); opacity: 0.35; }
}
@keyframes pk-edge-trail {
  0%, 17%    { opacity: 0; stroke-dashoffset: 1; }
  18%        { opacity: 1; }
  46%        { stroke-dashoffset: 0; opacity: 1; }
  84%        { stroke-dashoffset: 0; opacity: 1; }
  92%, 100%  { opacity: 0; stroke-dashoffset: 1; }
}
@keyframes pk-packet {
  0%, 17%    { opacity: 0; transform: translate(${start.x}px, ${start.y}px); }
  18%        { opacity: 1; }
  22%        { transform: translate(${0.7225 * start.x + 0.255 * ctrl.x + 0.0225 * end.x}px, ${0.7225 * start.y + 0.255 * ctrl.y + 0.0225 * end.y}px); }
  26%        { transform: translate(${0.49 * start.x + 0.42 * ctrl.x + 0.09 * end.x}px, ${0.49 * start.y + 0.42 * ctrl.y + 0.09 * end.y}px); }
  31%        { transform: translate(${0.3025 * start.x + 0.495 * ctrl.x + 0.2025 * end.x}px, ${0.3025 * start.y + 0.495 * ctrl.y + 0.2025 * end.y}px); }
  35%        { transform: translate(${0.16 * start.x + 0.48 * ctrl.x + 0.36 * end.x}px, ${0.16 * start.y + 0.48 * ctrl.y + 0.36 * end.y}px); }
  39%        { transform: translate(${0.0625 * start.x + 0.375 * ctrl.x + 0.5625 * end.x}px, ${0.0625 * start.y + 0.375 * ctrl.y + 0.5625 * end.y}px); }
  43%        { transform: translate(${0.01 * start.x + 0.18 * ctrl.x + 0.81 * end.x}px, ${0.01 * start.y + 0.18 * ctrl.y + 0.81 * end.y}px); }
  46%        { opacity: 1; transform: translate(${end.x}px, ${end.y}px); }
  47%, 100%  { opacity: 0; transform: translate(${end.x}px, ${end.y}px); }
}
.pk-a-border, .pk-b-border { animation-duration: 6.4s; animation-timing-function: linear; animation-iteration-count: infinite; }
.pk-a-border { animation-name: pk-a-border; }
.pk-b-border { animation-name: pk-b-border; }
.pk-a-icon { animation: pk-a-icon 6.4s cubic-bezier(0.34,1.56,0.64,1) infinite; }
.pk-b-icon { animation: pk-b-icon 6.4s cubic-bezier(0.34,1.56,0.64,1) infinite; }
.pk-edge-trail { animation: pk-edge-trail 6.4s linear infinite; }
.pk-packet { animation: pk-packet 6.4s linear infinite; }
.pk-static .pk-a-border, .pk-static .pk-b-border, .pk-static .pk-edge-trail {
  animation: none; opacity: 1; stroke-dashoffset: 0;
}
.pk-static .pk-a-icon, .pk-static .pk-b-icon { animation: none; opacity: 1; transform: none; }
.pk-static .pk-packet { animation: none; opacity: 0; }
`;

function CardShell({
  x,
  y,
  top,
  bottom,
  border,
  icon,
}: {
  x: number;
  y: number;
  top: string;
  bottom: string;
  border: string;
  icon: string;
}) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border border-fd-border bg-[var(--card)] p-2.5 shadow-sm"
      style={{ left: x, top: y, width: CARD_W, height: CARD_H }}
    >
      <div className="flex h-full w-full items-center gap-2">
        <span
          className={`${icon} relative z-raised flex size-6 shrink-0 items-center justify-center rounded-lg border border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-3"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <span className="relative z-raised flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="h-1.5 w-10 rounded-full bg-[var(--foreground)]/40" />
          <span className="h-1.5 w-7 rounded-full bg-[var(--foreground)]/20" />
        </span>
      </div>
      <svg
        aria-hidden="true"
        width={CARD_W}
        height={CARD_H}
        viewBox={`0 0 ${CARD_W} ${CARD_H}`}
        fill="none"
        className="pointer-events-none absolute inset-0 overflow-visible"
      >
        <path
          className={border}
          d={top}
          stroke="var(--primary)"
          strokeWidth={2}
          strokeLinecap="round"
          pathLength={1}
          style={{ strokeDasharray: 1 }}
        />
        <path
          className={border}
          d={bottom}
          stroke="var(--primary)"
          strokeWidth={2}
          strokeLinecap="round"
          pathLength={1}
          style={{ strokeDasharray: 1 }}
        />
      </svg>
    </div>
  );
}

export function AgentFlowPacket() {
  return (
    <ScrollScene
      label="Border → beam handoff"
      note="trace · light · flow · trace again"
    >
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full flex-col items-center gap-9 ${reduced ? "pk-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            className="relative max-w-full"
            style={{ width: B.x + half + 8, height: 130 }}
          >
            <svg
              aria-hidden="true"
              viewBox={`0 0 ${B.x + half + 8} 130`}
              fill="none"
              className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            >
              <path
                d={edgePath}
                stroke="var(--border)"
                strokeOpacity={0.6}
                strokeWidth={2}
                strokeLinecap="round"
              />
              <path
                className="pk-edge-trail"
                d={edgePath}
                stroke="var(--primary)"
                strokeWidth={2}
                strokeLinecap="round"
                pathLength={1}
                style={{ strokeDasharray: 1 }}
              />
              <circle
                className="pk-packet"
                cx={0}
                cy={0}
                r={4.5}
                fill="var(--primary)"
              />
            </svg>

            <CardShell
              x={A.x}
              y={A.y}
              top={CARD_TOP}
              bottom={CARD_BOTTOM}
              border="pk-a-border"
              icon="pk-a-icon"
            />
            <CardShell
              x={B.x}
              y={B.y}
              top={CARD_TOP}
              bottom={CARD_BOTTOM}
              border="pk-b-border"
              icon="pk-b-icon"
            />
          </div>

          <dl className="grid w-full max-w-[420px] grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--primary)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Trace / light
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                border draws on, icon pops at the midpoint
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--primary)]/50 ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Beam
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                packet sweeps the edge, fires the next trace on arrival
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
