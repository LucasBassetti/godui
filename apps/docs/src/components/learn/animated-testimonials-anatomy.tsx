"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Every portrait is mounted at once, absolutely stacked in the same box —
 * there's no carousel track sliding underneath. `isActive` just decides
 * each `motion.img`'s own `scale` / `rotate` / `y` / `zIndex`; the inactive
 * two keep their mount-time random `rotate` seed instead of resetting to 0.
 */
const CSS = `
@keyframes ata-plate { from { opacity: 0; transform: translateY(10px) scale(0.9); } to { opacity: var(--o); transform: translateY(var(--y)) scale(var(--s)) rotate(var(--r)); } }
.ata-plate { opacity: 0; animation: ata-plate 520ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.ata-static .ata-plate { opacity: var(--o); animation: none; transform: translateY(var(--y)) scale(var(--s)) rotate(var(--r)); }
`;

const PLATES: {
  o: number;
  y: string;
  s: number;
  r: string;
  z: number;
  d: string;
}[] = [
  { o: 0.5, y: "8px", s: 0.92, r: "-8deg", z: 1, d: "0ms" },
  { o: 0.5, y: "8px", s: 0.92, r: "6deg", z: 2, d: "90ms" },
  { o: 1, y: "0px", s: 1, r: "0deg", z: 3, d: "180ms" },
];

const LEGEND: { name: string; desc: string; kind: "active" | "inactive" }[] = [
  {
    name: "Active",
    desc: "scale 1 · rotate 0 · zIndex highest",
    kind: "active",
  },
  {
    name: "Inactive",
    desc: "opacity 0.5 · scale 0.92 · keeps its rotate seed",
    kind: "inactive",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "active") {
    return (
      <span className="h-4 w-6 rounded-md border border-fd-border bg-[var(--card)] shadow-sm" />
    );
  }
  return (
    <span className="h-4 w-6 rounded-md border border-fd-border bg-[var(--card)] opacity-50 shadow-sm" />
  );
}

export function AnimatedTestimonialsAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="one box · every portrait mounted">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[380px] flex-col items-center gap-9">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className={`relative h-48 w-40 [perspective:1000px] ${
              reduced ? "ata-static" : ""
            }`}
          >
            {PLATES.map((p, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed three-plate stack
                key={i}
                className="ata-plate absolute inset-0 rounded-2xl border border-border bg-[var(--card)] shadow-lg"
                style={
                  {
                    "--o": p.o,
                    "--y": p.y,
                    "--s": p.s,
                    "--r": p.r,
                    "--d": p.d,
                    zIndex: p.z,
                  } as CSSProperties
                }
              />
            ))}
          </div>

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
