"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * The magnification curve, played out as a loop: each item's size is a spring
 * chasing a target derived from its distance to the pointer
 * (`useTransform(mouseX, [-distance, 0, distance], [baseSize, magnification,
 * baseSize])`), so as the pointer sweeps the row, size ripples outward from
 * whichever item is closest. Faked here with five keyframed scales offset in
 * time to approximate that sweep.
 */
const CELLS = 5;
const CYCLE = "2.5s";

const CSS = `
@keyframes dm-sweep {
  0%, 60%, 100% { transform: scale(1); }
  30% { transform: scale(1.45); }
}
.dm-item { animation: dm-sweep ${CYCLE} cubic-bezier(0.34,1.4,0.64,1) var(--delay) infinite; }
.dm-static .dm-item { animation: none; transform: scale(1); }
`;

/** Per-cell negative delay so the same cycle's peak ripples left→right. */
function cellVars(i: number): CSSProperties {
  return { "--delay": `${(i - 2) * 0.16}s` } as CSSProperties;
}

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Distance map",
    desc: "[-distance, 0, distance] → [baseSize, magnification, baseSize]",
    swatch: "bg-[var(--foreground)]/30",
  },
  {
    name: "Spring",
    desc: "mass 0.1 · stiffness 170 · damping 12 chases the target size",
    swatch: "bg-[var(--foreground)]",
  },
];

export function DockMagnify() {
  return (
    <ScrollScene
      label="The motion"
      note="pointer sweeps · size ripples outward"
    >
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[480px] flex-col items-center gap-9">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`flex h-24 items-end gap-3 rounded-2xl border border-fd-border bg-[var(--card)] px-4 pb-3 shadow-sm ${
              reduced ? "dm-static" : ""
            }`}
          >
            {Array.from({ length: CELLS }).map((_, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length item row
                key={i}
                className="dm-item size-11 shrink-0 rounded-xl bg-[var(--muted)] shadow-sm"
                style={cellVars(i)}
              />
            ))}
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            useSpring(sizeTarget, {"{"} mass: 0.1, stiffness: 170, damping: 12{" "}
            {"}"})
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
