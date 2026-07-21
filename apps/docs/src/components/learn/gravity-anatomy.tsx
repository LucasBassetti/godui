"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * The canvas is just a `relative overflow-hidden` div. `Gravity` adds three
 * (or four, with `addTopWall`) static rectangle bodies far outside the
 * visible edges — thick enough that fast bodies can't tunnel through — and
 * every `MatterBody` becomes one more rectangle or circle body in the same
 * world. Bodies fade + drop into their rest angle on scroll-in.
 */
const CSS = `
@keyframes grv-drop { from { opacity: 0; transform: translateY(-18px) rotate(0deg); } to { opacity: 1; transform: translateY(0) rotate(var(--r)); } }
.grv-body { opacity: 0; animation: grv-drop 620ms cubic-bezier(0.3,0.7,0.4,1.1) var(--d) both; }
.grv-static .grv-body { opacity: 1; animation: none; transform: rotate(var(--r)); }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "World",
    desc: "relative overflow-hidden container, sized by CSS",
    swatch: "bg-[var(--card)] ring-1 ring-fd-border ring-inset",
  },
  {
    name: "Walls",
    desc: "static 200px-thick rectangles just past each edge",
    swatch: "bg-[var(--muted)]",
  },
  {
    name: "Body",
    desc: "one MatterBody = one rectangle or circle body",
    swatch: "bg-[var(--foreground)]/60",
  },
];

export function GravityAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="one world, thick walls, a few bodies">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[380px] flex-col items-center gap-9">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className={`relative h-[220px] w-[280px] overflow-hidden rounded-2xl border border-fd-border bg-[var(--card)] ${
              reduced ? "grv-static" : ""
            }`}
          >
            {/* walls — thick bars just inside the edges, standing in for the
                200px rectangles that actually sit outside the canvas */}
            <div className="absolute inset-x-0 bottom-0 h-3 bg-[var(--muted)]" />
            <div className="absolute inset-y-0 left-0 w-3 bg-[var(--muted)]" />
            <div className="absolute inset-y-0 right-0 w-3 bg-[var(--muted)]" />

            {/* bodies */}
            <div
              className="grv-body absolute bottom-3 left-8 h-8 w-24 rounded-[10px] bg-[var(--foreground)]/60"
              style={{ "--r": "-6deg", "--d": "0ms" } as CSSProperties}
            />
            <div
              className="grv-body absolute bottom-3 left-[132px] size-14 rounded-full bg-[var(--foreground)]/45"
              style={{ "--r": "0deg", "--d": "140ms" } as CSSProperties}
            />
            <div
              className="grv-body absolute bottom-14 left-[168px] h-7 w-20 rounded-[10px] bg-[var(--foreground)]/30"
              style={{ "--r": "10deg", "--d": "260ms" } as CSSProperties}
            />
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <span
                  className={`h-1.5 w-8 rounded-full ring-1 ring-fd-border ring-inset ${item.swatch}`}
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
