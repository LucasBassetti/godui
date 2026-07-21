"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Offscreen sampling: text/image is drawn to a canvas, then every `density`
 * px with alpha > 128 becomes a Particle { tx, ty, sx, sy, delay, jitter }.
 * This scene shows scatter seeds collapsing toward a formed glyph silhouette.
 */
const DOTS: { sx: number; sy: number; tx: number; ty: number; d: string }[] = [
  { sx: 20, sy: 30, tx: 110, ty: 70, d: "0ms" },
  { sx: 280, sy: 20, tx: 130, ty: 70, d: "40ms" },
  { sx: 40, sy: 140, tx: 150, ty: 70, d: "80ms" },
  { sx: 260, sy: 150, tx: 170, ty: 70, d: "60ms" },
  { sx: 30, sy: 80, tx: 120, ty: 90, d: "100ms" },
  { sx: 270, sy: 90, tx: 160, ty: 90, d: "20ms" },
  { sx: 80, sy: 20, tx: 140, ty: 50, d: "120ms" },
  { sx: 220, sy: 160, tx: 140, ty: 110, d: "50ms" },
  { sx: 50, sy: 50, tx: 125, ty: 55, d: "90ms" },
  { sx: 250, sy: 50, tx: 155, ty: 55, d: "30ms" },
  { sx: 70, sy: 130, tx: 125, ty: 105, d: "110ms" },
  { sx: 230, sy: 120, tx: 155, ty: 105, d: "70ms" },
  { sx: 15, sy: 100, tx: 115, ty: 80, d: "140ms" },
  { sx: 290, sy: 110, tx: 165, ty: 80, d: "10ms" },
  { sx: 100, sy: 15, tx: 135, ty: 45, d: "150ms" },
  { sx: 200, sy: 15, tx: 145, ty: 45, d: "35ms" },
  { sx: 90, sy: 155, tx: 135, ty: 115, d: "130ms" },
  { sx: 210, sy: 155, tx: 145, ty: 115, d: "45ms" },
  { sx: 160, sy: 10, tx: 140, ty: 40, d: "25ms" },
  { sx: 160, sy: 165, tx: 140, ty: 120, d: "85ms" },
];

const CSS = `
@keyframes pda-dot {
  from { transform: translate(var(--sx), var(--sy)); opacity: 0.25; }
  to   { transform: translate(var(--tx), var(--ty)); opacity: 1; }
}
@keyframes pda-frame {
  from { opacity: 0; transform: scale(0.96); }
  to   { opacity: 1; transform: scale(1); }
}
.pda-dot { animation: pda-dot 900ms cubic-bezier(0.45,0.05,0.55,0.95) var(--d) both; }
.pda-frame { animation: pda-frame 500ms ease both; }
.pda-static .pda-dot { animation: none; opacity: 1; transform: translate(var(--tx), var(--ty)); }
.pda-static .pda-frame { animation: none; opacity: 1; transform: none; }
`;

const LEGEND = [
  {
    name: "Sample",
    desc: "offscreen canvas · alpha > 128",
    swatch: "bg-[var(--muted)]",
  },
  {
    name: "Targets",
    desc: "tx, ty from pixel grid",
    swatch: "bg-[var(--foreground)]/50",
  },
  {
    name: "Scatter",
    desc: "sx, sy random across canvas",
    swatch: "bg-transparent ring-1 ring-[var(--foreground)]/40 ring-inset",
  },
] as const;

export function ParticleDissolveAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="sample → Particle[] · density step">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[440px] flex-col items-center gap-9 ${reduced ? "pda-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            className="pda-frame relative overflow-hidden rounded-2xl border border-dashed border-[var(--foreground)]/25 bg-[var(--card)]"
            style={{ width: 320, height: 180 }}
          >
            {DOTS.map((dot) => (
              <span
                key={`${dot.sx}-${dot.sy}-${dot.tx}-${dot.ty}`}
                aria-hidden="true"
                className="pda-dot absolute size-1.5 rounded-[1px] bg-[var(--foreground)]/70"
                style={
                  {
                    left: 0,
                    top: 0,
                    "--sx": `${dot.sx}px`,
                    "--sy": `${dot.sy}px`,
                    "--tx": `${dot.tx}px`,
                    "--ty": `${dot.ty}px`,
                    "--d": dot.d,
                  } as CSSProperties
                }
              />
            ))}
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            {"for y+=density · for x+=density · if alpha > 128"}
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
