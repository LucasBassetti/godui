"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Fixed DOM pool of `max` <img> slots (default 12), recycled round-robin via
 * slotIndex % max. No create/destroy per spawn — just retarget src + animate.
 */
const CSS = `
@keyframes ita-pop {
  from { opacity: 0; transform: scale(0.7); }
  to   { opacity: 1; transform: scale(1); }
}
.ita-slot {
  animation: ita-pop 500ms cubic-bezier(0.3, 0.7, 0.4, 1.2) var(--d) both;
}
.ita-active {
  outline: 2px solid color-mix(in oklab, var(--foreground) 55%, transparent);
  outline-offset: 2px;
}
.ita-static .ita-slot { animation: none; opacity: 1; transform: none; }
`;

const SLOTS = 8;
const ACTIVE = 3;

const LEGEND = [
  {
    name: "Pool slots",
    desc: "Array.from({ length: max }) · refs into slots.current",
    swatch: "bg-[var(--muted)]",
  },
  {
    name: "Active write",
    desc: "slots[slotIndex % max] · round-robin reuse",
    swatch: "bg-[var(--foreground)]/50",
  },
] as const;

export function ImageTrailAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="fixed pool · round-robin recycle">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[440px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`grid grid-cols-4 gap-3 ${reduced ? "ita-static" : ""}`}
          >
            {Array.from({ length: SLOTS }).map((_, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed pool diagram
                key={i}
                className={`ita-slot size-14 rounded-xl bg-[var(--muted)] shadow-sm ${
                  i === ACTIVE ? "ita-active bg-[var(--foreground)]/35" : ""
                }`}
                style={{ "--d": `${i * 45}ms` } as CSSProperties}
              />
            ))}
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            const img = slots.current[slotIndex.current % max]
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
