"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * The three layers that make up the tilted card: the card itself (rotateX/Y
 * from the spring-smoothed pointer), a content layer that floats toward the
 * viewer via `translateZ(depth)` inside the same `preserve-3d` box, and a
 * glare layer on top whose radial gradient is centered on the pointer.
 */
const CSS = `
@keyframes tca-explode {
  from { opacity: 0; transform: translateZ(var(--tz0)); }
  to   { opacity: 1; transform: translateZ(var(--tz)); }
}
.tca-plate {
  position: absolute; inset: 0; margin: auto;
  opacity: 0; transform: translateZ(var(--tz));
  animation: tca-explode 900ms cubic-bezier(0.3, 0.7, 0.4, 1.2) var(--d) both;
}
.tca-static .tca-plate { opacity: 1; animation: none; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Card (z 0)",
    desc: "rotateX/Y from the spring-smoothed pointer",
    swatch: "bg-[var(--card)]",
  },
  {
    name: "Content (translateZ 40px)",
    desc: "children float toward the viewer for parallax",
    swatch: "bg-[var(--muted)]",
  },
  {
    name: "Glare (topmost)",
    desc: "radial highlight centered on the pointer",
    swatch: "bg-white/70",
  },
];

export function TiltCardAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="one preserve-3d box, three layers">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[480px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`flex h-[190px] items-center justify-center [perspective:1000px] ${reduced ? "tca-static" : ""}`}
          >
            <div className="relative h-[130px] w-[190px] [transform:rotateX(55deg)_rotateZ(-38deg)] [transform-style:preserve-3d]">
              <div
                className="tca-plate rounded-2xl border border-fd-border bg-[var(--card)] shadow-md"
                style={
                  {
                    "--tz": "0px",
                    "--tz0": "-20px",
                    "--d": "0ms",
                  } as CSSProperties
                }
              />
              <div
                className="tca-plate flex items-center justify-center rounded-2xl border border-white/10 bg-[var(--muted)]"
                style={
                  {
                    "--tz": "34px",
                    "--tz0": "10px",
                    "--d": "150ms",
                  } as CSSProperties
                }
              >
                <span className="h-2 w-14 rounded-full bg-[var(--foreground)]/30" />
              </div>
              <div
                className="tca-plate rounded-2xl [background:radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.6),transparent_60%)]"
                style={
                  {
                    "--tz": "58px",
                    "--tz0": "34px",
                    "--d": "300ms",
                  } as CSSProperties
                }
              />
            </div>
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
