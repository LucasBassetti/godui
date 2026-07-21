"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * `AnimatedBeam` recomputes its path in a `ResizeObserver` callback (plus a
 * window `resize` listener) — it never assumes the container is stable. Here
 * the `from` node drifts down (standing in for the container growing) and
 * the path's `d` is re-derived from the same quadratic formula at every
 * stop, exactly like `update()` does on every observed resize.
 */
const TO = { x: 264, y: 95 };
const CURVATURE = 30;

function pathFor(fromY: number) {
  const ctrlX = (56 + TO.x) / 2;
  const ctrlY = (fromY + TO.y) / 2 - CURVATURE;
  return `M 56,${fromY} Q ${ctrlX},${ctrlY} ${TO.x},${TO.y}`;
}

const REST_Y = 60;
const MOVED_Y = 130;

const CSS = `
@keyframes abm-path {
  0%, 12%  { d: path("${pathFor(REST_Y)}"); }
  50%      { d: path("${pathFor(MOVED_Y)}"); }
  88%, 100%{ d: path("${pathFor(REST_Y)}"); }
}
@keyframes abm-node {
  0%, 12%  { transform: translateY(0px); }
  50%      { transform: translateY(${MOVED_Y - REST_Y}px); }
  88%, 100%{ transform: translateY(0px); }
}
@keyframes abm-badge {
  0%, 6%    { opacity: 0; transform: scale(0.85); }
  10%, 18%  { opacity: 1; transform: scale(1); }
  24%, 84%  { opacity: 0; transform: scale(0.85); }
  88%, 96%  { opacity: 1; transform: scale(1); }
  100%      { opacity: 0; transform: scale(0.85); }
}
.abm-path { animation: abm-path 4.8s cubic-bezier(0.3,0.7,0.4,1) infinite; }
.abm-node { animation: abm-node 4.8s cubic-bezier(0.3,0.7,0.4,1) infinite; }
.abm-badge { animation: abm-badge 4.8s linear infinite; }
.abm-static .abm-path { animation: none; d: path("${pathFor(REST_Y)}"); }
.abm-static .abm-node { animation: none; transform: none; }
.abm-static .abm-badge { animation: none; opacity: 0; }
`;

const LEGEND = [
  {
    name: "From node",
    desc: "container/window resize moves it",
    kind: "from",
  },
  {
    name: "Path",
    desc: "d re-derived from live rects, every measure",
    kind: "path",
  },
  {
    name: "ResizeObserver",
    desc: "+ window resize listener trigger update()",
    kind: "observer",
  },
] as const;

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "from") {
    return (
      <span className="size-3 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
    );
  }
  if (kind === "path") {
    return (
      <span className="h-0.5 w-8 rounded-full bg-[var(--foreground)]/55 ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="h-3 w-6 rounded-md border border-dashed border-[var(--foreground)]/25 bg-transparent ring-1 ring-fd-border ring-inset" />
  );
}

export function AnimatedBeamMeasure() {
  return (
    <ScrollScene label="Remeasure" note="ResizeObserver + window resize">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[420px] flex-col items-center gap-9 ${reduced ? "abm-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="relative" style={{ width: 320, height: 170 }}>
            <div
              aria-hidden="true"
              className="absolute rounded-xl border border-dashed border-[var(--foreground)]/25"
              style={{ left: 10, top: 8, width: 300, height: 154 }}
            />

            <svg
              aria-hidden="true"
              width={320}
              height={170}
              viewBox="0 0 320 170"
              fill="none"
              className="pointer-events-none absolute inset-0 overflow-visible"
            >
              <path
                className="abm-path"
                d={pathFor(REST_Y)}
                stroke="var(--foreground)"
                strokeOpacity={0.55}
                strokeWidth={2}
                strokeLinecap="round"
              />
            </svg>

            <div
              className="abm-node absolute rounded-full bg-[var(--muted)] shadow-sm"
              style={{ left: 56 - 18, top: REST_Y - 18, width: 36, height: 36 }}
            />
            <div
              className="absolute flex items-center justify-center rounded-full border border-fd-border bg-[var(--card)] shadow-md"
              style={{ left: TO.x - 24, top: TO.y - 24, width: 48, height: 48 }}
            >
              <span className="h-2 w-6 rounded-full bg-[var(--foreground)]/30" />
            </div>

            <span
              aria-hidden="true"
              className="abm-badge absolute top-0 right-2 flex size-6 items-center justify-center rounded-full border border-fd-border bg-[var(--card)] shadow-sm"
            >
              <span className="size-1.5 rounded-full bg-[var(--foreground)]" />
            </span>
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            {"update() re-runs on every ResizeObserver + window resize tick"}
          </p>

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
