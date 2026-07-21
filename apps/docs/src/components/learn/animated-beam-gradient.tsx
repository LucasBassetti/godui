"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * The real beam never moves a shape — it slides a `<linearGradient>`'s
 * `x1`/`x2` across a *static* path (`gradient.x1: ["10%","110%"]`, linear,
 * infinite, `reverse` flips the array). CSS can't tween SVG gradient
 * attributes directly, so this stands in with one soft `radialGradient`
 * blob translating along the identical quadratic path via `transform`
 * (compositor-only). A second delayed halo used to ride the same path
 * ~120ms behind and read as a double core — one glow is enough.
 */
const FROM = { x: 48, y: 70 };
const TO = { x: 272, y: 70 };
const CTRL = { x: 160, y: 30 };
const PATH = `M ${FROM.x},${FROM.y} Q ${CTRL.x},${CTRL.y} ${TO.x},${TO.y}`;

// Quadratic bezier samples at t = 0, .125, .25 … 1 — P(t) = (1-t)²P0 + 2(1-t)tC + t²P2.
const STOPS: [number, number][] = [
  [48, 70],
  [76, 61],
  [104, 55],
  [132, 51],
  [160, 50],
  [188, 51],
  [216, 55],
  [244, 61],
  [272, 70],
];

const CSS = `
@keyframes abg-travel {
  0%     { transform: translate(${STOPS[0][0]}px, ${STOPS[0][1]}px); opacity: 0; }
  6%     { opacity: 1; }
  12.5%  { transform: translate(${STOPS[1][0]}px, ${STOPS[1][1]}px); }
  25%    { transform: translate(${STOPS[2][0]}px, ${STOPS[2][1]}px); }
  37.5%  { transform: translate(${STOPS[3][0]}px, ${STOPS[3][1]}px); }
  50%    { transform: translate(${STOPS[4][0]}px, ${STOPS[4][1]}px); }
  62.5%  { transform: translate(${STOPS[5][0]}px, ${STOPS[5][1]}px); }
  75%    { transform: translate(${STOPS[6][0]}px, ${STOPS[6][1]}px); }
  87.5%  { transform: translate(${STOPS[7][0]}px, ${STOPS[7][1]}px); }
  94%    { opacity: 1; }
  100%   { transform: translate(${STOPS[8][0]}px, ${STOPS[8][1]}px); opacity: 0; }
}
.abg-glow { animation: abg-travel 3s linear infinite; }
.abg-static .abg-glow { animation: none; opacity: 1; transform: translate(${STOPS[4][0]}px, ${STOPS[4][1]}px); }
`;

const LEGEND = [
  {
    name: "Gradient",
    desc: "x1/x2 tween 10%→110%, linear, 3s, infinite",
    kind: "gradient",
  },
  {
    name: "Path",
    desc: "static, pathOpacity 0.2 — never redrawn for this",
    kind: "path",
  },
  {
    name: "Reverse",
    desc: "flips the array: 90%→−10% instead",
    kind: "reverse",
  },
] as const;

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "gradient") {
    return (
      <span className="size-3.5 rounded-full bg-[var(--primary)] blur-[2px] ring-1 ring-fd-border ring-inset" />
    );
  }
  if (kind === "path") {
    return (
      <span className="h-0.5 w-8 rounded-full bg-[var(--foreground)]/20 ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="size-3 rounded-full bg-[var(--primary)]/40 ring-1 ring-fd-border ring-inset [transform:scaleX(-1)]" />
  );
}

export function AnimatedBeamGradient() {
  return (
    <ScrollScene
      label="The showpiece"
      note="linearGradient x1/x2 · linear · 3s"
    >
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[420px] flex-col items-center gap-9 ${reduced ? "abg-static" : ""}`}
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
                d={PATH}
                stroke="var(--foreground)"
                strokeOpacity={0.2}
                strokeWidth={2}
                strokeLinecap="round"
              />
              <defs>
                {/* Soft falloff — one core, no hard mid stop that reads as a second disc. */}
                <radialGradient
                  id="abg-glow-grad"
                  cx="50%"
                  cy="50%"
                  r="50%"
                  fx="50%"
                  fy="50%"
                >
                  <stop
                    offset="0%"
                    stopColor="var(--primary)"
                    stopOpacity={1}
                  />
                  <stop
                    offset="35%"
                    stopColor="var(--primary)"
                    stopOpacity={0.45}
                  />
                  <stop
                    offset="70%"
                    stopColor="var(--primary)"
                    stopOpacity={0.12}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--primary)"
                    stopOpacity={0}
                  />
                </radialGradient>
              </defs>
              <circle
                className="abg-glow"
                cx={0}
                cy={0}
                r={14}
                fill="url(#abg-glow-grad)"
              />
            </svg>

            <div
              className="absolute rounded-full bg-[var(--muted)] shadow-sm"
              style={{
                left: FROM.x - 22,
                top: FROM.y - 22,
                width: 44,
                height: 44,
              }}
            />
            <div
              className="absolute flex items-center justify-center rounded-full border border-fd-border bg-[var(--card)] shadow-md"
              style={{ left: TO.x - 26, top: TO.y - 26, width: 52, height: 52 }}
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
