"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * The container is a Framer `variants` pair: `hidden`/`visible` on the grid
 * with `staggerChildren: 0.08`, and each `BentoCard` carries the matching
 * `itemVariants` (`opacity 0→1`, `y 20→0`, spring `stiffness 320 / damping 32
 * / mass 0.9`). `whileInView` with `viewport={{ once: true }}` fires it once,
 * the first time the grid scrolls in — exactly what this scene replays.
 */
const CELLS = 6;

const CSS = `
@keyframes bgs-rise { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.bgs-cell { opacity: 0; animation: bgs-rise 620ms cubic-bezier(0.22,1.28,0.36,1) var(--d) both; }
.bgs-static .bgs-cell { opacity: 1; animation: none; transform: none; }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "stagger" | "spring";
}[] = [
  {
    name: "staggerChildren",
    desc: "0.08s between each card's start",
    kind: "stagger",
  },
  {
    name: "Item spring",
    desc: "stiffness 320 · damping 32 · mass 0.9",
    kind: "spring",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "stagger") {
    return (
      <span className="flex gap-0.5">
        <span className="h-2.5 w-2 rounded-md border border-fd-border bg-[var(--card)] opacity-40 ring-1 ring-fd-border ring-inset" />
        <span className="h-2.5 w-2 rounded-md border border-fd-border bg-[var(--card)] opacity-70 ring-1 ring-fd-border ring-inset" />
        <span className="h-2.5 w-2 rounded-md border border-fd-border bg-[var(--card)] ring-1 ring-fd-border ring-inset" />
      </span>
    );
  }
  return (
    <span className="h-3 w-5 rounded-xl border border-fd-border bg-[var(--card)] ring-1 ring-fd-border ring-inset" />
  );
}

export function BentoGridStagger() {
  return (
    <ScrollScene label="The motion" note="staggerChildren 0.08s · spring in">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[420px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`grid w-full grid-cols-3 gap-3 ${reduced ? "bgs-static" : ""}`}
          >
            {Array.from({ length: CELLS }).map((_, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length item row
                key={i}
                className="bgs-cell h-16 rounded-xl border border-fd-border bg-[var(--card)] shadow-sm"
                style={{ "--d": `${i * 80}ms` } as CSSProperties}
              />
            ))}
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            {
              'transition: { type: "spring", stiffness: 320, damping: 32, mass: 0.9 }'
            }
          </p>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <LegendSwatch kind={item.kind} />
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
