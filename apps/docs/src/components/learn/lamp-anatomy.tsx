"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Structural map of `Lamp`: two mirrored conic cones meeting at a glowing
 * bar, a radial wash under the seam, and a children slot that rides above
 * the light. Geometry matches the real component (origin-right / origin-left
 * cones, bar at the top seam) — grayscale so the silhouette reads first.
 */
const CSS = `
@keyframes la-in {
  from { opacity: 0; transform: scaleY(0.85); }
  to   { opacity: 1; transform: scaleY(1); }
}
@keyframes la-bar {
  from { opacity: 0; transform: scaleX(0.4); }
  to   { opacity: 1; transform: scaleX(1); }
}
@keyframes la-child {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.la-cone { animation: la-in 700ms cubic-bezier(0.3,0.7,0.4,1) var(--d) both; transform-origin: top center; }
.la-bar  { animation: la-bar 600ms cubic-bezier(0.3,0.7,0.4,1) 180ms both; }
.la-wash { animation: la-in 700ms cubic-bezier(0.3,0.7,0.4,1) 120ms both; }
.la-slot { animation: la-child 600ms cubic-bezier(0.3,0.7,0.4,1) 320ms both; }
.la-static .la-cone,
.la-static .la-wash,
.la-static .la-slot { animation: none; opacity: 1; transform: none; }
.la-static .la-bar  { animation: none; opacity: 1; transform: none; }
`;

const LEGEND = [
  {
    name: "Left cone",
    desc: "conic from 290deg, origin-left",
    swatch: "bg-[var(--muted)]",
  },
  {
    name: "Right cone",
    desc: "conic from 70deg, origin-right",
    swatch: "bg-[var(--card)] ring-1 ring-fd-border ring-inset",
  },
  {
    name: "Bar + wash",
    desc: "scaleX seam + radial ellipse",
    swatch: "bg-[var(--foreground)]/50",
  },
  {
    name: "Children",
    desc: "slot rises into the light",
    swatch: "bg-[var(--foreground)]/25",
  },
] as const;

export function LampAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="two cones · bar · wash · children">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[440px] flex-col items-center gap-9 ${reduced ? "la-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            className="relative isolate overflow-hidden rounded-2xl border border-fd-border bg-[var(--card)]"
            style={{ width: 360, height: 220 }}
          >
            <div className="absolute inset-0 flex items-start justify-center pt-6">
              {/* Right cone (from 70deg) — mirrored left half */}
              <div
                className="la-cone absolute right-1/2 h-36 w-56 origin-right"
                style={
                  {
                    "--d": "0ms",
                    backgroundImage:
                      "conic-gradient(from 70deg at center top, color-mix(in oklch, var(--foreground) 35%, transparent), transparent, transparent)",
                    maskImage: "linear-gradient(to top, transparent, white)",
                    WebkitMaskImage:
                      "linear-gradient(to top, transparent, white)",
                  } as CSSProperties
                }
              />
              {/* Left cone (from 290deg) */}
              <div
                className="la-cone absolute left-1/2 h-36 w-56 origin-left"
                style={
                  {
                    "--d": "80ms",
                    backgroundImage:
                      "conic-gradient(from 290deg at center top, transparent, transparent, color-mix(in oklch, var(--foreground) 35%, transparent))",
                    maskImage: "linear-gradient(to top, transparent, white)",
                    WebkitMaskImage:
                      "linear-gradient(to top, transparent, white)",
                  } as CSSProperties
                }
              />
              <div
                className="la-wash absolute top-6 h-28 w-full"
                style={{
                  background:
                    "radial-gradient(ellipse at center top, color-mix(in oklch, var(--foreground) 18%, transparent), transparent 60%)",
                }}
              />
              <div className="la-bar absolute top-[3.25rem] z-raised h-0.5 w-40 rounded-full bg-[var(--foreground)]/70 blur-[1px]" />
            </div>

            <div className="la-slot absolute inset-x-0 bottom-10 flex flex-col items-center gap-2">
              <span className="h-2 w-28 rounded-full bg-[var(--foreground)]/30" />
              <span className="h-2 w-16 rounded-full bg-[var(--foreground)]/20" />
            </div>
          </div>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5 sm:grid-cols-4">
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
