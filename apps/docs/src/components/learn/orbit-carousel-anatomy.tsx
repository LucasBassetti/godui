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
 *
 * Legend columns mirror the five slots left→right so each label sits under
 * its card — not a collapsed Front/Neighbor/Edge key stretched full-width.
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
  name: string;
  desc: string;
};

// offset = i - active, at radius 150 / angleStep 28° — same formula as OrbitItem.
// Radius picked so slot gaps clear a w-14 legend cell under each plate.
const SLOTS: Slot[] = [
  {
    offset: -2,
    x: -133,
    y: 70,
    scale: 0.66,
    opacity: 0.42,
    rotate: -14,
    delay: 0,
    name: "Edge",
    desc: "−2",
  },
  {
    offset: -1,
    x: -75,
    y: 19,
    scale: 0.83,
    opacity: 0.71,
    rotate: -7,
    delay: 80,
    name: "Neighbor",
    desc: "−1",
  },
  {
    offset: 0,
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    rotate: 0,
    delay: 160,
    name: "Front",
    desc: "0",
  },
  {
    offset: 1,
    x: 75,
    y: 19,
    scale: 0.83,
    opacity: 0.71,
    rotate: 7,
    delay: 80,
    name: "Neighbor",
    desc: "+1",
  },
  {
    offset: 2,
    x: 133,
    y: 70,
    scale: 0.66,
    opacity: 0.42,
    rotate: 14,
    delay: 0,
    name: "Edge",
    desc: "+2",
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
          className={`flex w-full max-w-[420px] flex-col items-center gap-8 ${reduced ? "oca-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="relative h-40 w-full">
            {SLOTS.map((slot) => (
              <div
                key={slot.offset}
                className="oca-el absolute top-0 left-1/2 size-14 rounded-2xl border border-border bg-[var(--foreground)] shadow-md"
                style={
                  {
                    marginLeft: -28,
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

          {/* Same x offsets as the cards — arc spacing isn't equal, so a
              grid would drift off the plates. */}
          <dl className="relative h-[4.25rem] w-full border-fd-border border-t pt-5">
            {SLOTS.map((slot) => (
              <div
                key={slot.offset}
                className="absolute top-5 left-1/2 flex w-[3.25rem] flex-col items-center gap-0.5 text-center"
                style={{ transform: `translateX(calc(-50% + ${slot.x}px))` }}
              >
                <span
                  className="h-1.5 w-5 rounded-full bg-[var(--foreground)] ring-1 ring-fd-border ring-inset"
                  style={{ opacity: slot.opacity }}
                />
                <dt className="font-medium text-[10px] text-fd-foreground leading-tight">
                  {slot.name}
                </dt>
                <dd className="font-mono text-[10px] text-fd-muted-foreground">
                  {slot.desc}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
