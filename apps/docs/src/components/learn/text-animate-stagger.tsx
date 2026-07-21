"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Container variants drive staggerChildren; each segment is a child with
 * matching item variants. Default stagger is duration / segments.length
 * (or STAGGER_BY_SPLIT[by] when there's only one segment). Replay remounts
 * via key={cycle} so CSS delays restart cleanly.
 */
const BARS = 6;
const STAGGER_MS = 80;

const CSS = `
@keyframes tas-rise {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.tas-bar {
  opacity: 0;
  animation: tas-rise 520ms cubic-bezier(0.22, 1.1, 0.36, 1) var(--d) both;
}
.tas-static .tas-bar { opacity: 1; animation: none; transform: none; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "staggerChildren",
    desc: "delay between each segment's start",
    swatch: "bg-[var(--foreground)]/30",
  },
  {
    name: "default stagger",
    desc: "duration / segments.length · or STAGGER_BY_SPLIT",
    swatch: "bg-[var(--foreground)]/70",
  },
];

const WIDTHS = [40, 28, 52, 24, 44, 36];

export function TextAnimateStagger() {
  return (
    <ScrollScene
      label="Stagger"
      note="cascade · delayChildren + staggerChildren"
    >
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[480px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className={`flex h-20 w-full flex-wrap items-center justify-center gap-2 rounded-xl border border-fd-border bg-[var(--muted)]/30 px-6 ${reduced ? "tas-static" : ""}`}
            aria-hidden="true"
          >
            {Array.from({ length: BARS }).map((_, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length stagger row
                key={i}
                className="tas-bar h-2 rounded-full bg-[var(--foreground)]/30"
                style={
                  {
                    width: `${WIDTHS[i]}px`,
                    "--d": `${i * STAGGER_MS}ms`,
                  } as CSSProperties
                }
              />
            ))}
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            {"stagger ?? duration / segments.length"}
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
