"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * When `active` advances, nothing slides — every plate just re-targets the
 * same four values (`opacity` / `scale` / `rotate` / `y`) on the same
 * spring, and whichever index matches `active` becomes the one sitting at
 * `scale: 1, rotate: 0`. Three plates share one keyframe here, each started
 * a third of a cycle apart so the "become active" role visibly rotates
 * between them.
 */
const CYCLE = "4.5s";

const CSS = `
@keyframes tst-role {
  0%, 63%, 100% { transform: translateY(8px) scale(0.92) rotate(var(--r)); opacity: 0.5; z-index: 1; }
  33%           { transform: translateY(0px) scale(1) rotate(0deg); opacity: 1; z-index: 3; }
}
.tst-plate { animation: tst-role ${CYCLE} cubic-bezier(0.34,1.15,0.64,1) var(--delay) infinite; }
.tst-static .tst-plate { animation: none; transform: translateY(0) scale(1) rotate(0deg); opacity: 1; }
`;

const PLATES: { r: string; delay: string }[] = [
  { r: "-8deg", delay: "0s" },
  { r: "6deg", delay: "-1.5s" },
  { r: "-3deg", delay: "-3s" },
];

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Spring",
    desc: "stiffness 320 · damping 32 · mass 0.9",
    swatch: "bg-[var(--foreground)]/30",
  },
  {
    name: "Rotate seed",
    desc: "random -8°..8°, fixed once per item via useMemo",
    swatch: "bg-[var(--foreground)]/60",
  },
];

export function AnimatedTestimonialsStack() {
  return (
    <ScrollScene label="The motion" note="active re-targets · nothing slides">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[380px] flex-col items-center gap-9 ${
            reduced ? "tst-static" : ""
          }`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="relative h-48 w-40">
            {PLATES.map((p, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed three-plate stack
                key={i}
                className="tst-plate absolute inset-0 rounded-2xl border border-border bg-[var(--card)] shadow-lg"
                style={{ "--r": p.r, "--delay": p.delay } as CSSProperties}
              />
            ))}
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            {'{ type: "spring", stiffness: 320, damping: 32, mass: 0.9 }'}
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
