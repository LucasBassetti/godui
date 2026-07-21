"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Spawns only when pointer travel since the last spawn is ≥ threshold
 * (default 64px). Distance via Math.hypot(dx, dy); tilt from atan2(dy, dx).
 */
const CSS = `
@keyframes itt-travel {
  0%   { offset-distance: 0%; }
  100% { offset-distance: 100%; }
}
@keyframes itt-spawn {
  0%        { opacity: 0; transform: translate(-50%, -50%) scale(0.4); }
  10%       { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  28%       { opacity: 0.45; transform: translate(-50%, -50%) scale(0.92); }
  42%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.85); }
}
.itt-path {
  offset-path: path("M 24 120 C 80 40, 200 40, 260 100");
  offset-rotate: 0deg;
  animation: itt-travel 2.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
.itt-mark {
  position: absolute;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--muted);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.08);
  opacity: 0;
  animation: itt-spawn 2.8s cubic-bezier(0.22, 1, 0.36, 1) both infinite;
}
.itt-static .itt-path { animation: none; offset-distance: 55%; }
.itt-static .itt-mark {
  animation: none;
  opacity: 0.7;
  transform: translate(-50%, -50%) scale(1);
}
`;

const MARKS = [
  { left: "18%", top: "58%", delay: "0ms" },
  { left: "38%", top: "28%", delay: "0.55s" },
  { left: "58%", top: "22%", delay: "1.1s" },
  { left: "78%", top: "48%", delay: "1.65s" },
] as const;

const LEGEND = [
  {
    name: "Threshold",
    desc: "Math.hypot(dx, dy) < 64 → return early",
    swatch: "bg-transparent ring-1 ring-[var(--foreground)]/40 ring-inset",
  },
  {
    name: "Spawn",
    desc: "place slot · tilt from atan2(dy, dx)",
    swatch: "bg-[var(--muted)]",
  },
] as const;

export function ImageTrailThreshold() {
  return (
    <ScrollScene label="The threshold" note="≥ 64px travel between spawns">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[400px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`relative h-[160px] w-full max-w-[300px] overflow-hidden rounded-xl border border-fd-border bg-[var(--card)] ${reduced ? "itt-static" : ""}`}
          >
            <svg
              aria-hidden="true"
              className="absolute inset-0 size-full"
              viewBox="0 0 300 160"
              fill="none"
            >
              <path
                d="M 24 120 C 80 40, 200 40, 260 100"
                stroke="var(--foreground)"
                strokeOpacity={0.2}
                strokeWidth={1.5}
                strokeDasharray="4 6"
              />
            </svg>
            {MARKS.map((m) => (
              <div
                key={m.left}
                className="itt-mark"
                style={{
                  left: m.left,
                  top: m.top,
                  animationDelay: m.delay,
                }}
              />
            ))}
            <div className="itt-path absolute left-0 top-0 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--foreground)]" />
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            if (Math.hypot(dx, dy) &lt; threshold) return
          </p>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
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
