"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * DEFAULTS from confetti.tsx: spread 70, startVelocity 45, particleCount 120,
 * origin.y 0.7, disableForReducedMotion: true. Particles are grayscale
 * token chips — color isn't the mechanism.
 *
 * Diagram: origin + centered 70° spread cone. Travel distance of the chips
 * stands in for startVelocity (legend); the wedge is angle-only, not speed.
 */
const PARTICLES = [
  { x: -42, y: -70, rot: -28, d: "0ms", s: 10 },
  { x: 10, y: -88, rot: 14, d: "40ms", s: 8 },
  { x: 48, y: -62, rot: 36, d: "80ms", s: 12 },
  { x: -55, y: -82, rot: -42, d: "100ms", s: 7 },
  { x: 38, y: -40, rot: 28, d: "120ms", s: 9 },
  { x: -22, y: -48, rot: -12, d: "60ms", s: 6 },
  { x: 26, y: -74, rot: 18, d: "90ms", s: 7 },
  { x: 0, y: -98, rot: 4, d: "20ms", s: 11 },
] as const;

const CSS = `
@keyframes cfa-burst {
  0%   { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0.4); }
  18%  { opacity: 1; }
  100% { opacity: 0.85; transform: translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(1); }
}
.cfa-p { animation: cfa-burst 700ms cubic-bezier(0.22, 1, 0.36, 1) var(--d) both; }

@keyframes cfa-origin {
  from { opacity: 0; transform: scale(0.7); }
  to   { opacity: 1; transform: scale(1); }
}
.cfa-origin { animation: cfa-origin 420ms cubic-bezier(0.3,0.7,0.4,1.2) both; }

@keyframes cfa-cone {
  from { opacity: 0; transform: translate(-50%, -100%) scale(0.85); }
  to   { opacity: 1; transform: translate(-50%, -100%) scale(1); }
}
.cfa-cone { animation: cfa-cone 500ms cubic-bezier(0.3,0.7,0.4,1) 60ms both; transform-origin: 50% 100%; }

.cfa-static .cfa-p {
  animation: none;
  opacity: 0.85;
  transform: translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(1);
}
.cfa-static .cfa-origin { animation: none; opacity: 1; transform: none; }
.cfa-static .cfa-cone { animation: none; opacity: 1; transform: translate(-50%, -100%) scale(1); }
`;

const LEGEND = [
  {
    name: "spread",
    desc: "70° cone — how wide the burst fans",
    swatch: "bg-[var(--muted)]",
  },
  {
    name: "startVelocity",
    desc: "45 — how far chips travel from origin",
    swatch: "bg-[var(--foreground)]/40",
  },
  {
    name: "particleCount",
    desc: "120 pieces per fire(); origin.y defaults to 0.7",
    swatch: "bg-[var(--card)] ring-1 ring-fd-border ring-inset",
  },
] as const;

export function ConfettiAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="DEFAULTS · spread 70 · n 120">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[360px] flex-col items-center gap-9 ${reduced ? "cfa-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="relative h-[200px] w-full">
            {/* Explicit 70° SVG wedge (apex at origin, opening upward) —
                conic-gradient angle math was reading as a sideways spike. */}
            <svg
              aria-hidden="true"
              className="cfa-cone pointer-events-none absolute top-[70%] left-1/2 h-32 w-48 overflow-visible"
              viewBox="0 0 192 128"
              fill="none"
            >
              {/* 70° wedge: apex (96,128), rays at ±35° from vertical, R=115 */}
              <path
                d="M96 128 L30 34 A115 115 0 0 0 162 34 Z"
                fill="var(--foreground)"
                fillOpacity={0.12}
              />
              <path
                d="M96 128 L30 34 M96 128 L162 34"
                stroke="var(--foreground)"
                strokeOpacity={0.3}
                strokeWidth={1.25}
                strokeLinecap="round"
              />
            </svg>

            {/* Origin marker at y ≈ 0.7 of the stage */}
            <div className="cfa-origin absolute top-[70%] left-1/2 z-raised size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--foreground)]/50 ring-4 ring-[var(--foreground)]/10" />

            {PARTICLES.map((p, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: static particle list
                key={i}
                className="cfa-p absolute top-[70%] left-1/2 rounded-[2px] bg-[var(--foreground)]/45"
                style={
                  {
                    width: p.s,
                    height: Math.round(p.s * 0.55),
                    marginLeft: -p.s / 2,
                    marginTop: -Math.round(p.s * 0.55) / 2,
                    "--tx": `${p.x}px`,
                    "--ty": `${p.y}px`,
                    "--rot": `${p.rot}deg`,
                    "--d": p.d,
                  } as CSSProperties
                }
              />
            ))}
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
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
