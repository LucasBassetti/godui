"use client";

import { Gravity, MatterBody } from "@godui/components";

const TAGS: { label: string; x: string; y: string; angle: number }[] = [
  { label: "design", x: "20%", y: "0%", angle: -8 },
  { label: "motion", x: "42%", y: "10%", angle: 4 },
  { label: "physics", x: "64%", y: "0%", angle: -4 },
  { label: "react", x: "82%", y: "14%", angle: 8 },
];

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * `Gravity` canvas. Grab a pill and fling it; drop back in and watch it
 * settle against the others and the walls.
 */
export function GravityResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — drag a pill and fling it
        </span>
      </div>
      <div className="p-6 md:p-10">
        <Gravity className="h-[360px] w-full rounded-xl border border-border bg-muted/20">
          {TAGS.map((tag) => (
            <MatterBody key={tag.label} x={tag.x} y={tag.y} angle={tag.angle}>
              <span className="rounded-full bg-primary px-5 py-2.5 text-lg font-medium text-primary-foreground">
                {tag.label}
              </span>
            </MatterBody>
          ))}
        </Gravity>
      </div>
    </div>
  );
}
