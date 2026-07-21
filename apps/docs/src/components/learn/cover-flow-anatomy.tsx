"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Five slides, one signed distance each. `offset = index - active` drives
 * every visual: the center slide (offset 0) faces the camera flat; neighbours
 * rotate away in perspective and recede in depth the farther they sit. This
 * mirrors `CoverItem`'s own math, just at demo scale.
 */
const COUNT = 5;
const ACTIVE = 2;
const SPACING = 62;

function coverTransform(offset: number, reduced: boolean) {
  const sign = Math.sign(offset);
  const abs = Math.abs(offset);
  const near = Math.min(abs, 1);
  const far = Math.max(abs - 1, 0);
  const x = sign * (near * SPACING + far * SPACING * 0.55);
  const rotateY = reduced ? 0 : -Math.max(-1, Math.min(1, offset)) * 52;
  const z = reduced ? 0 : -Math.min(abs, 3) * 56;
  const scale = 1 - Math.min(abs, 3) * 0.08;
  const opacity =
    abs > 3.4 ? 0 : Math.max(0.15, 1 - Math.max(abs - 1, 0) * 0.28);
  return { x, rotateY, z, scale, opacity };
}

const CSS = `
@keyframes cfa-in { from { opacity: 0; transform: translateY(10px) scale(0.92); } to { opacity: 1; transform: none; } }
.cfa-slide { animation: cfa-in 620ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.cfa-static .cfa-slide { animation: none; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Center slide",
    desc: "offset 0 — flat, full scale, faces the camera",
    swatch: "bg-[var(--foreground)]/70",
  },
  {
    name: "Neighbours",
    desc: "offset ±1, ±2 — rotateY, translateZ, and scale by distance",
    swatch: "bg-[var(--muted)]",
  },
];

export function CoverFlowAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="one signed distance, five slides">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[480px] flex-col items-center gap-9">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`relative h-[168px] w-full [perspective:900px] ${reduced ? "cfa-static" : ""}`}
          >
            <div className="absolute inset-0 [transform-style:preserve-3d]">
              {Array.from({ length: COUNT }).map((_, i) => {
                const offset = i - ACTIVE;
                const t = coverTransform(offset, reduced);
                const isCenter = offset === 0;
                return (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length slide row
                    key={i}
                    className="cfa-slide absolute top-1/2 left-1/2 size-16 rounded-xl border border-border shadow-sm"
                    style={
                      {
                        marginLeft: -32,
                        marginTop: -32,
                        zIndex: Math.round(100 - Math.abs(offset) * 10),
                        "--d": `${Math.abs(offset) * 90}ms`,
                        transform: `translateX(${t.x}px) translateZ(${t.z}px) rotateY(${t.rotateY}deg) scale(${t.scale})`,
                        opacity: t.opacity,
                        background: isCenter
                          ? "var(--foreground)"
                          : "var(--muted)",
                      } as CSSProperties
                    }
                  />
                );
              })}
            </div>
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            rotateY = -clamp(offset, -1, 1) × 52° · z = -min(|offset|, 3) ×
            depth
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
