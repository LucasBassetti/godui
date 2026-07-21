"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Auto-mode spotlight: a position sweeps 0 → last (mirror loop). Each segment's
 * weight is `lerp(min, max, clamp(1 - |i − pos| / AUTO_SPREAD, 0, 1))` with
 * AUTO_SPREAD = 2.5. Diagrammed as scaleY on token bars — taller under the
 * spotlight — compositor-only.
 */

const CHARS = 9;
const CYCLE = "2.8s";

const CSS = `
@keyframes ets-sweep {
  0%, 100% { transform: scaleY(0.32); opacity: 0.35; }
  50%      { transform: scaleY(1);    opacity: 0.9; }
}
.ets-bar {
  transform-origin: bottom center;
  animation: ets-sweep ${CYCLE} ease-in-out var(--delay) infinite alternate;
}
.ets-static .ets-bar { animation: none; transform: scaleY(0.45); opacity: 0.5; }
.ets-static .ets-bar:nth-child(4),
.ets-static .ets-bar:nth-child(5) { transform: scaleY(1); opacity: 0.9; }
`;

/** Stagger so the peak ripples left→right, then mirror via alternate. */
function barVars(i: number): CSSProperties {
  return { "--delay": `${(i / (CHARS - 1)) * -2.4}s` } as CSSProperties;
}

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Spotlight",
    desc: "MotionValue · starts at −AUTO_SPREAD",
    swatch: "bg-[var(--foreground)]/30",
  },
  {
    name: "Influence",
    desc: "clamp(1 − |i − pos| / 2.5, 0, 1)",
    swatch: "bg-[var(--foreground)]",
  },
];

export function ElasticTextSpotlight() {
  return (
    <ScrollScene
      label="Auto spotlight"
      note="sweep · AUTO_SPREAD=2.5 · mirror loop"
    >
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[480px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`flex h-28 items-end justify-center gap-2 ${reduced ? "ets-static" : ""}`}
            aria-hidden="true"
          >
            {Array.from({ length: CHARS }).map((_, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length segment row
                key={i}
                className="ets-bar h-24 w-3 rounded-sm bg-[var(--foreground)] sm:w-3.5"
                style={barVars(i)}
              />
            ))}
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            {'animate(spotlight, [0, last], { repeatType: "mirror" })'}
          </p>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
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
