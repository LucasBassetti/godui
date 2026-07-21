"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Every slide's position comes from one number — its signed distance from
 * the active slide (`offset = i - active`) — fed through
 * `angle = offset * angleStep`, then `x = radius·sin(angle)`,
 * `y = radius·(1 − cos(angle))`. `scale` and `opacity` fall off with
 * `|angle|` on their own curves, so the arc reads as a continuous wheel
 * instead of discrete "current / not current" states. Numbers below use the
 * real formula at a scaled-down radius so the shape matches the component.
 */
const CSS = `
@keyframes oca-in { from { opacity: 0; transform: translateY(8px) scale(0.9); } to { opacity: var(--o); transform: translate(var(--x), var(--y)) scale(var(--s)) rotate(var(--r)); } }
.oca-el { opacity: 0; animation: oca-in 480ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.oca-static .oca-el { opacity: var(--o); animation: none; transform: translate(var(--x), var(--y)) scale(var(--s)) rotate(var(--r)); }
`;

type Slot = {
  offset: number;
  x: number;
  y: number;
  scale: number;
  opacity: number;
  rotate: number;
  delay: number;
};

// offset = i - active, at radius 96 / angleStep 26° — same formula as OrbitItem.
const SLOTS: Slot[] = [
  {
    offset: -2,
    x: -76,
    y: 37,
    scale: 0.69,
    opacity: 0.46,
    rotate: -13,
    delay: 0,
  },
  {
    offset: -1,
    x: -42,
    y: 10,
    scale: 0.84,
    opacity: 0.73,
    rotate: -6.5,
    delay: 80,
  },
  { offset: 0, x: 0, y: 0, scale: 1, opacity: 1, rotate: 0, delay: 160 },
  {
    offset: 1,
    x: 42,
    y: 10,
    scale: 0.84,
    opacity: 0.73,
    rotate: 6.5,
    delay: 80,
  },
  { offset: 2, x: 76, y: 37, scale: 0.69, opacity: 0.46, rotate: 13, delay: 0 },
];

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Front",
    desc: "offset 0 — scale 1, opacity 1",
    swatch: "bg-[var(--foreground)]",
  },
  {
    name: "Neighbor",
    desc: "|offset| 1 — scale 0.84, opacity 0.73",
    swatch: "bg-[var(--foreground)]/60",
  },
  {
    name: "Edge",
    desc: "|offset| 2 — scale 0.69, opacity 0.46",
    swatch: "bg-[var(--foreground)]/35",
  },
];

export function OrbitCarouselAnatomy() {
  return (
    <ScrollScene
      label="Anatomy"
      note="position, scale, opacity from one offset"
    >
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-9 ${reduced ? "oca-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="relative h-32 w-full">
            {SLOTS.map((slot) => (
              <div
                key={slot.offset}
                className="oca-el absolute top-0 left-1/2 size-16 rounded-2xl border border-border bg-[var(--card)] shadow-md"
                style={
                  {
                    marginLeft: -32,
                    zIndex: 10 - Math.abs(slot.offset),
                    "--x": `${slot.x}px`,
                    "--y": `${slot.y}px`,
                    "--s": slot.scale,
                    "--o": slot.opacity,
                    "--r": `${slot.rotate}deg`,
                    "--d": `${slot.delay}ms`,
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
