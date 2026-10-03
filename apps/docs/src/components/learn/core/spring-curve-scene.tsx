"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { ScrollScene } from "../scroll-scene";

/**
 * Plots a `godui-motion` easing token. The curve is read back from the browser
 * (a hidden probe carries the static `ease-*` utility), so the scene draws the
 * exact `linear()` / `cubic-bezier()` that ships — no duplicated numbers.
 */
const PROBE = {
  snappy: "ease-spring-snappy",
  smooth: "ease-spring-smooth",
  bouncy: "ease-spring-bouncy",
  expo: "ease-out-expo",
} as const;

export type SpringEasing = keyof typeof PROBE;

const W = 280;
const H = 140;
const MIN = -0.1;
const MAX = 1.3;

/** `linear(0, 0.05 4%, …)` → points; `cubic-bezier(a,b,c,d)` → sampled. */
function samples(easing: string): Array<[number, number]> {
  const lin = /^linear\((.*)\)$/.exec(easing.trim());
  if (lin) {
    const stops = lin[1].split(",").map((s) => s.trim().split(/\s+/));
    return stops.map(([v, pct], i) => [
      pct?.endsWith("%")
        ? Number.parseFloat(pct) / 100
        : i / (stops.length - 1),
      Number.parseFloat(v),
    ]);
  }
  const bez = /^cubic-bezier\(([^)]*)\)$/.exec(easing.trim());
  if (bez) {
    const [x1, y1, x2, y2] = bez[1].split(",").map(Number);
    const at = (t: number, a: number, b: number) =>
      3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t ** 2 * b + t ** 3;
    return Array.from({ length: 41 }, (_, i) => {
      const t = i / 40;
      return [at(t, x1, x2), at(t, y1, y2)] as [number, number];
    });
  }
  return [
    [0, 0],
    [1, 1],
  ];
}

const toSvg = ([x, y]: [number, number]) =>
  `${(x * W).toFixed(1)},${(H - ((y - MIN) / (MAX - MIN)) * H).toFixed(1)}`;

export function SpringCurveScene({
  label,
  note,
  easing,
}: {
  label: string;
  note?: string;
  easing: SpringEasing;
}) {
  const probe = useRef<HTMLSpanElement>(null);
  const [curve, setCurve] = useState("");
  useLayoutEffect(() => {
    if (probe.current)
      setCurve(getComputedStyle(probe.current).transitionTimingFunction);
  }, []);
  const points = curve ? samples(curve).map(toSvg).join(" ") : "";
  const target = H - ((1 - MIN) / (MAX - MIN)) * H;

  const travel = W - 24;

  return (
    <>
      {/* Probe lives outside the scene so it exists before the scene plays. */}
      <span ref={probe} className={cn("hidden", PROBE[easing])} />
      <ScrollScene label={label} note={note}>
        {({ cycle, reduced }) => (
          <div className="flex w-full max-w-[320px] flex-col items-center gap-6">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full overflow-visible"
              aria-hidden="true"
            >
              <line
                x1={0}
                x2={W}
                y1={target}
                y2={target}
                className="stroke-fd-border"
                strokeDasharray="4 4"
              />
              <polyline
                points={points}
                fill="none"
                className="stroke-[var(--foreground)]"
                strokeWidth={2}
              />
            </svg>
            <div
              className="relative h-6 rounded-full bg-[var(--muted)]"
              style={{ width: W }}
            >
              <span
                key={cycle}
                className="absolute top-1 left-1 size-4 rounded-full bg-[var(--foreground)]"
                style={
                  reduced || !curve
                    ? { translate: `${travel}px 0` }
                    : {
                        animation: `core-curve-run 900ms ${curve} both`,
                      }
                }
              />
            </div>
            <style>{`@keyframes core-curve-run { from { translate: 0 0; } to { translate: ${travel}px 0; } }`}</style>
            <p className="max-w-full truncate font-mono text-[11px] text-fd-muted-foreground">
              {PROBE[easing]}
            </p>
          </div>
        )}
      </ScrollScene>
    </>
  );
}
