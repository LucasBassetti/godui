"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Four absolute-inset layers stacked on one card: a dark base, a diagonal
 * foil band (`mix-blend-color-dodge`), a glitter dot mask (same blend), and a
 * soft radial glare on top. Kept grayscale here — the foil's actual
 * iridescence is the showpiece scene right after this one.
 */
const CSS = `
@keyframes hca-explode {
  from { opacity: 0; transform: translateZ(var(--tz0)); }
  to   { opacity: 1; transform: translateZ(var(--tz)); }
}
.hca-plate {
  position: absolute; inset: 0; margin: auto;
  opacity: 0; transform: translateZ(var(--tz));
  animation: hca-explode 900ms cubic-bezier(0.3, 0.7, 0.4, 1.2) var(--d) both;
}
.hca-static .hca-plate { opacity: 1; animation: none; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Base",
    desc: "dark radial gradient — seats the foil so it reads as light",
    swatch: "bg-black/70",
  },
  {
    name: "Foil",
    desc: "diagonal gradient, mix-blend-color-dodge",
    swatch: "bg-[var(--muted)]",
  },
  {
    name: "Sparkle",
    desc: "glitter dot mask, same blend mode",
    swatch: "bg-white/35",
  },
  {
    name: "Glare",
    desc: "soft radial highlight, tracks the pointer",
    swatch: "bg-white/75",
  },
];

export function HolographicCardAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="four masks, one blend mode">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[520px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`flex h-[190px] items-center justify-center [perspective:1000px] ${reduced ? "hca-static" : ""}`}
          >
            <div className="relative h-[140px] w-[190px] [transform:rotateX(55deg)_rotateZ(-38deg)] [transform-style:preserve-3d]">
              <div
                className="hca-plate rounded-2xl bg-black/70"
                style={
                  {
                    "--tz": "0px",
                    "--tz0": "-20px",
                    "--d": "0ms",
                  } as CSSProperties
                }
              />
              <div
                className="hca-plate rounded-2xl border border-white/10 [background-image:linear-gradient(115deg,rgba(255,255,255,0.04),rgba(255,255,255,0.4),rgba(255,255,255,0.04))]"
                style={
                  {
                    "--tz": "20px",
                    "--tz0": "0px",
                    "--d": "130ms",
                  } as CSSProperties
                }
              />
              <div
                className="hca-plate rounded-2xl opacity-70 [background-image:radial-gradient(rgba(255,255,255,0.6)_1px,transparent_1.8px)] [background-size:6px_6px]"
                style={
                  {
                    "--tz": "40px",
                    "--tz0": "20px",
                    "--d": "260ms",
                  } as CSSProperties
                }
              />
              <div
                className="hca-plate rounded-2xl [background:radial-gradient(40%_40%_at_50%_40%,rgba(255,255,255,0.7),transparent_72%)]"
                style={
                  {
                    "--tz": "60px",
                    "--tz0": "40px",
                    "--d": "390ms",
                  } as CSSProperties
                }
              />
            </div>
          </div>

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
