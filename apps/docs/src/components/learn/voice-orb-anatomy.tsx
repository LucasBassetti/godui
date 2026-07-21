"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Three concentric layers: spinning corona (outer blur), breathing core
 * (radial sphere), listening ring (border pulse). Matches VoiceOrb's
 * absolute-stacked silhouette — no invented geometry.
 */
const CSS = `
@keyframes voa-in {
  from { opacity: 0; transform: scale(0.88); }
  to   { opacity: 1; transform: scale(1); }
}
.voa-layer { animation: voa-in 700ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.voa-static .voa-layer { animation: none; opacity: 1; transform: none; }
`;

const LEGEND = [
  {
    name: "Corona",
    desc: "conic spin · amp scale",
    swatch:
      "size-3 rounded-full bg-[var(--foreground)]/15 blur-[2px] ring-1 ring-fd-border ring-inset",
  },
  {
    name: "Core",
    desc: "breathe + amp swell",
    swatch:
      "size-3 rounded-full border border-border bg-[var(--card)] ring-1 ring-fd-border ring-inset",
  },
  {
    name: "Ring",
    desc: "listening only",
    swatch:
      "size-3 rounded-full border border-[var(--ring)]/60 bg-transparent ring-1 ring-fd-border ring-inset",
  },
] as const;

export function VoiceOrbAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="corona · core · ring">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[420px] flex-col items-center gap-8 ${reduced ? "voa-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="relative size-40">
            {/* Corona */}
            <div
              className="voa-layer absolute inset-0 rounded-full bg-[var(--foreground)]/15 blur-xl"
              style={{ "--d": "0ms" } as CSSProperties}
            />
            {/* Core */}
            <div
              className="voa-layer absolute inset-[11%] rounded-full border border-border bg-[var(--card)] shadow-lg"
              style={{ "--d": "120ms" } as CSSProperties}
            >
              <span className="absolute left-[22%] top-[16%] size-[28%] rounded-full bg-[var(--foreground)]/15 blur-sm" />
            </div>
            {/* Ring */}
            <div
              className="voa-layer absolute inset-0 rounded-full border border-[var(--ring)]/60"
              style={{ "--d": "240ms" } as CSSProperties}
            />
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <span className={item.swatch} />
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
