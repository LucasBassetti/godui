"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Assemble / disperse / loop: progress `p` eases toward `goal` (×0.06 each
 * frame); per-particle delay + easeInOut maps scatter→form. Loop flips goal
 * every 2600ms. Idle shimmer (sin) once formed.
 */
const PARTICLES: {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  delay: string;
}[] = [
  { sx: 12, sy: 24, tx: 100, ty: 55, delay: "0s" },
  { sx: 300, sy: 18, tx: 120, ty: 55, delay: "0.08s" },
  { sx: 28, sy: 150, tx: 140, ty: 55, delay: "0.16s" },
  { sx: 290, sy: 155, tx: 160, ty: 55, delay: "0.05s" },
  { sx: 18, sy: 90, tx: 110, ty: 75, delay: "0.22s" },
  { sx: 305, sy: 95, tx: 150, ty: 75, delay: "0.12s" },
  { sx: 60, sy: 20, tx: 130, ty: 40, delay: "0.18s" },
  { sx: 250, sy: 165, tx: 130, ty: 95, delay: "0.1s" },
  { sx: 40, sy: 55, tx: 115, ty: 45, delay: "0.28s" },
  { sx: 270, sy: 50, tx: 145, ty: 45, delay: "0.06s" },
  { sx: 55, sy: 130, tx: 115, ty: 90, delay: "0.2s" },
  { sx: 255, sy: 125, tx: 145, ty: 90, delay: "0.14s" },
  { sx: 8, sy: 110, tx: 105, ty: 65, delay: "0.32s" },
  { sx: 310, sy: 70, tx: 155, ty: 65, delay: "0.04s" },
  { sx: 90, sy: 12, tx: 125, ty: 35, delay: "0.24s" },
  { sx: 210, sy: 14, tx: 135, ty: 35, delay: "0.15s" },
  { sx: 95, sy: 160, tx: 125, ty: 100, delay: "0.26s" },
  { sx: 215, sy: 158, tx: 135, ty: 100, delay: "0.09s" },
  { sx: 165, sy: 8, tx: 130, ty: 30, delay: "0.02s" },
  { sx: 165, sy: 170, tx: 130, ty: 105, delay: "0.3s" },
  { sx: 75, sy: 75, tx: 120, ty: 60, delay: "0.11s" },
  { sx: 235, sy: 80, tx: 140, ty: 60, delay: "0.19s" },
  { sx: 50, sy: 40, tx: 118, ty: 50, delay: "0.07s" },
  { sx: 265, sy: 140, tx: 142, ty: 85, delay: "0.21s" },
];

const CSS = `
@keyframes pdc-cycle {
  0%, 8%     { transform: translate(var(--sx), var(--sy)); opacity: 0.2; }
  38%, 55%   { transform: translate(var(--tx), var(--ty)); opacity: 1; }
  85%, 100%  { transform: translate(var(--sx), var(--sy)); opacity: 0.2; }
}
@keyframes pdc-breathe {
  0%, 100% { transform: translate(var(--tx), var(--ty)) translate(0, 0); }
  50%      { transform: translate(var(--tx), var(--ty)) translate(0.6px, -0.6px); }
}
.pdc-dot { animation: pdc-cycle 5.2s cubic-bezier(0.45,0.05,0.55,0.95) var(--delay) infinite; }
.pdc-static .pdc-dot {
  animation: pdc-breathe 2.4s ease-in-out infinite;
  opacity: 1;
}
`;

const LEGEND = [
  {
    name: "Assemble",
    desc: "goal → 1 · easeInOut per particle",
    swatch: "bg-[var(--foreground)]/50",
  },
  {
    name: "Disperse",
    desc: "goal → 0 · back to sx, sy",
    swatch: "bg-[var(--muted)]",
  },
  {
    name: "Loop",
    desc: "flip goal every 2600ms",
    swatch: "bg-transparent ring-1 ring-[var(--foreground)]/40 ring-inset",
  },
] as const;

export function ParticleDissolveCycle() {
  return (
    <ScrollScene label="Cycle" note="assemble · disperse · loop 2.6s">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[440px] flex-col items-center gap-9 ${reduced ? "pdc-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            className="relative overflow-hidden rounded-2xl border border-fd-border bg-[var(--card)]"
            style={{ width: 320, height: 180 }}
          >
            {PARTICLES.map((pt) => (
              <span
                key={`${pt.sx}-${pt.sy}-${pt.tx}-${pt.ty}`}
                aria-hidden="true"
                className="pdc-dot absolute size-1.5 rounded-[1px] bg-[var(--foreground)]/75"
                style={
                  {
                    left: 0,
                    top: 0,
                    "--sx": `${pt.sx}px`,
                    "--sy": `${pt.sy}px`,
                    "--tx": `${pt.tx}px`,
                    "--ty": `${pt.ty}px`,
                    "--delay": pt.delay,
                  } as CSSProperties
                }
              />
            ))}
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            {"p += (goal − p) × 0.06 · easeInOut((p − delay) / (1 − delay))"}
          </p>

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
