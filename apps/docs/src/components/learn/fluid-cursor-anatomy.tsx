"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Portal-rendered cursor stack: soft trail (size × 2.4, blur) under a sharp
 * leading dot. At rest they share one center — lag only shows while moving.
 */
const CSS = `
@keyframes fca-in {
  from { opacity: 0; transform: translate(-50%, -50%) scale(0.6); }
  to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}
.fca-el {
  animation: fca-in 600ms cubic-bezier(0.3, 0.7, 0.4, 1.2) var(--d) both;
}
.fca-static .fca-el {
  animation: none;
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}
`;

const LEGEND = [
  {
    name: "Trail",
    desc: "size × 2.4 · blur-md · lerp 0.12",
    swatch: "bg-[var(--foreground)]/25",
  },
  {
    name: "Dot",
    desc: "leading circle · lerp 0.25 · same center at rest",
    swatch: "bg-[var(--foreground)]",
  },
] as const;

export function FluidCursorAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="portal · trail under · dot over">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[400px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`relative flex h-[180px] w-full items-center justify-center rounded-xl border border-fd-border bg-[var(--card)] ${reduced ? "fca-static" : ""}`}
          >
            {/* Shared anchor — both elements centered on the same point */}
            <div className="absolute left-1/2 top-1/2 size-0">
              <div
                className="fca-el absolute left-0 top-0 rounded-full bg-[var(--foreground)]/20 blur-md"
                style={
                  {
                    width: 54,
                    height: 54,
                    "--d": "0ms",
                  } as CSSProperties
                }
              />
              <div
                className="fca-el absolute left-0 top-0 rounded-full bg-[var(--foreground)]"
                style={
                  {
                    width: 18,
                    height: 18,
                    "--d": "140ms",
                  } as CSSProperties
                }
              />
            </div>
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            createPortal(…, containerRef ?? document.body)
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
