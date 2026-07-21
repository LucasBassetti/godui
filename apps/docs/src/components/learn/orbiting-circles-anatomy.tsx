"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Same geometry the component computes: `box = radius*2 + iconSize`, slots
 * at `angle = (360/n)*i` placed with `rotate(angle) translateY(-radius)`.
 * Four slots at 0/90/180/270 land at top/right/bottom/left — exactly what's
 * drawn here. The ring itself renders nothing; the thin spokes stand in for
 * the invisible `motion.div` that actually carries the slots around.
 */
const RADIUS = 78;
const SLOT = 30;
const N = 4;
const SLOTS = Array.from({ length: N }, (_, i) => (360 / N) * i);

const CSS = `
@keyframes orb-in {
  from { opacity: 0; transform: scale(0.85); }
  to   { opacity: 1; transform: scale(1); }
}
.orb-el { animation: orb-in 480ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.orb-static .orb-el { animation: none; opacity: 1; transform: none; }
`;

const LEGEND = [
  {
    name: "Path",
    desc: "showPath — a faint static circle at radius*2",
    swatch: "border border-dashed border-[var(--foreground)]/40 bg-transparent",
  },
  {
    name: "Ring",
    desc: "invisible motion.div, rotates 360° and carries every slot",
    swatch: "bg-transparent ring-1 ring-[var(--foreground)]/40 ring-inset",
  },
  {
    name: "Slot",
    desc: "rotate(angle) translateY(−radius), one per child",
    swatch: "bg-[var(--foreground)]/50",
  },
] as const;

export function OrbitingCirclesAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="path · ring · slot">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[380px] flex-col items-center gap-9 ${reduced ? "orb-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            className="relative"
            style={{ width: RADIUS * 2 + SLOT, height: RADIUS * 2 + SLOT }}
          >
            {/* Path */}
            <div
              className="orb-el absolute rounded-full border border-dashed border-[var(--foreground)]/25"
              style={
                {
                  left: "50%",
                  top: "50%",
                  width: RADIUS * 2,
                  height: RADIUS * 2,
                  marginLeft: -RADIUS,
                  marginTop: -RADIUS,
                  "--d": "0ms",
                } as CSSProperties
              }
            />

            {/* Center */}
            <div
              className="orb-el absolute flex items-center justify-center rounded-xl bg-[var(--foreground)]/10"
              style={
                {
                  left: "50%",
                  top: "50%",
                  width: 64,
                  height: 32,
                  marginLeft: -32,
                  marginTop: -16,
                  "--d": "60ms",
                } as CSSProperties
              }
            >
              <span className="h-1.5 w-8 rounded-full bg-[var(--foreground)]/40" />
            </div>

            {/* Ring spokes + slots */}
            {SLOTS.map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x = RADIUS * Math.sin(rad);
              const y = -RADIUS * Math.cos(rad);
              return (
                <svg
                  // biome-ignore lint/suspicious/noArrayIndexKey: fixed 4-slot ring
                  key={i}
                  aria-hidden="true"
                  className="orb-el pointer-events-none absolute left-1/2 top-1/2 overflow-visible"
                  width="1"
                  height="1"
                  style={{ "--d": `${120 + i * 60}ms` } as CSSProperties}
                >
                  <line
                    x1={0}
                    y1={0}
                    x2={x}
                    y2={y}
                    stroke="var(--foreground)"
                    strokeOpacity={0.18}
                    strokeWidth={1.5}
                  />
                </svg>
              );
            })}

            {SLOTS.map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x = RADIUS * Math.sin(rad);
              const y = -RADIUS * Math.cos(rad);
              return (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: fixed 4-slot ring
                  key={i}
                  className="orb-el absolute rounded-full border border-fd-border bg-[var(--card)] shadow-sm"
                  style={
                    {
                      left: "50%",
                      top: "50%",
                      width: SLOT,
                      height: SLOT,
                      marginLeft: x - SLOT / 2,
                      marginTop: y - SLOT / 2,
                      "--d": `${150 + i * 60}ms`,
                    } as CSSProperties
                  }
                />
              );
            })}
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
