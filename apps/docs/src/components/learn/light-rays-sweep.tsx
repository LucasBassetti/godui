"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Make the ±6° sweep + scale breathe obvious: a sharp wedge fan with a
 * visible angle arc, plus a rest ↔ swept pair so the motion isn't lost in blur.
 */
const CSS = `
@keyframes lrs-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.lrs-el { animation: lrs-in 550ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.lrs-static .lrs-el { animation: none; opacity: 1; transform: none; }

@keyframes lrs-sweep {
  0%   { transform: rotate(-6deg) scale(1); opacity: 0.55; }
  100% { transform: rotate(6deg) scale(1.08); opacity: 0.85; }
}
.lrs-fan {
  animation: lrs-sweep 2.4s ease-in-out infinite alternate;
  transform-origin: top center;
}
.lrs-static .lrs-fan { animation: none; opacity: 0.7; transform: rotate(6deg) scale(1.08); }

@keyframes lrs-arc {
  0%   { transform: rotate(-6deg); }
  100% { transform: rotate(6deg); }
}
.lrs-needle {
  transform-origin: bottom center;
  animation: lrs-arc 2.4s ease-in-out infinite alternate;
}
.lrs-static .lrs-needle { animation: none; transform: rotate(6deg); }
`;

const FAN =
  "repeating-conic-gradient(from 0deg at 50% 0%, transparent 0deg, rgba(0,0,0,0.42) 3.5deg, transparent 24deg)";

export function LightRaysSweep() {
  return (
    <ScrollScene label="Sweep" note="±6° rotate · scale 1→1.08 · alternate">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-8 ${reduced ? "lrs-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="grid w-full grid-cols-2 gap-4">
            {/* Rest — frozen at center angle */}
            <div
              className="lrs-el flex flex-col items-center gap-2"
              style={{ "--d": "0ms" } as CSSProperties}
            >
              <div className="relative h-40 w-full overflow-hidden rounded-xl border border-fd-border bg-[var(--card)]">
                <div
                  className="absolute inset-[-30%] origin-top opacity-50"
                  style={{
                    backgroundImage: FAN,
                    WebkitMaskImage:
                      "linear-gradient(to bottom, black 5%, transparent 80%)",
                    maskImage:
                      "linear-gradient(to bottom, black 5%, transparent 80%)",
                  }}
                />
                <AngleMarks />
              </div>
              <span className="font-mono text-[11px] text-fd-muted-foreground">
                rest · 0°
              </span>
            </div>

            {/* Live sweep */}
            <div
              className="lrs-el flex flex-col items-center gap-2"
              style={{ "--d": "120ms" } as CSSProperties}
            >
              <div className="relative h-40 w-full overflow-hidden rounded-xl border border-fd-border bg-[var(--card)]">
                <div
                  className="lrs-fan absolute inset-[-30%] origin-top"
                  style={{
                    backgroundImage: FAN,
                    WebkitMaskImage:
                      "linear-gradient(to bottom, black 5%, transparent 80%)",
                    maskImage:
                      "linear-gradient(to bottom, black 5%, transparent 80%)",
                  }}
                />
                <AngleMarks live />
              </div>
              <span className="font-mono text-[11px] text-fd-muted-foreground">
                sweep · ±6°
              </span>
            </div>
          </div>

          <p className="max-w-[38ch] text-center text-[13px] text-fd-muted-foreground">
            The needle tracks the same keyframe as the fan: rotate ±6°, scale up
            to 1.08, opacity breathes. Duration{" "}
            <span className="font-mono text-[12px]">14s / speed</span>,
            alternate forever — frozen under{" "}
            <span className="font-mono text-[12px]">motion-reduce</span>.
          </p>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Transform
              </dt>
              <dd className="font-mono text-[12px] text-fd-muted-foreground">
                rotate(±6deg) scale(1→1.08)
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Timing
              </dt>
              <dd className="font-mono text-[12px] text-fd-muted-foreground">
                ease-in-out alternate · --rays-speed
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}

function AngleMarks({ live = false }: { live?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* arc guides */}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 60"
        className="absolute top-0 left-1/2 h-16 w-28 -translate-x-1/2 text-[var(--foreground)]"
      >
        <path
          d="M28 8 A 28 28 0 0 1 72 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeDasharray="2 2"
          opacity={0.25}
        />
        {/* endpoint ticks for ±6° — labels live in the caption/legend */}
        <line
          x1="28"
          y1="8"
          x2="26"
          y2="14"
          stroke="currentColor"
          strokeWidth="0.8"
          opacity={0.35}
        />
        <line
          x1="72"
          y1="8"
          x2="74"
          y2="14"
          stroke="currentColor"
          strokeWidth="0.8"
          opacity={0.35}
        />
      </svg>
      {/* pivot */}
      <div className="absolute top-0 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-[var(--foreground)]/50" />
      {/* needle */}
      <div
        className={`absolute top-0 left-1/2 h-14 w-px -translate-x-1/2 bg-[var(--foreground)]/45 ${live ? "lrs-needle" : ""}`}
      />
    </div>
  );
}
