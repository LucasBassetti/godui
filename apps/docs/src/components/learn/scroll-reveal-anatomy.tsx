"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Direction maps through OFFSET: up → {x:0,y:1}, down → {0,-1}, left →
 * {1,0}, right → {-1,0}. Hidden state multiplies that by `distance` (default
 * 40). The plate here settles from "up".
 */

const CSS = `
@keyframes sra-plate {
  from {
    opacity: 0;
    transform: translateY(40px);
    filter: blur(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}
@keyframes sra-arrow {
  from { opacity: 0; transform: scale(0.8); }
  to   { opacity: 1; transform: scale(1); }
}
.sra-plate { animation: sra-plate 900ms cubic-bezier(0.3,0.7,0.4,1.2) 180ms both; }
.sra-dir   { animation: sra-arrow 480ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.sra-static .sra-plate { animation: none; opacity: 1; transform: none; filter: none; }
.sra-static .sra-dir   { animation: none; opacity: 1; transform: none; }
`;

const DIRS = [
  { name: "up", tip: "M12 19V5M5 12l7-7 7 7", d: "0ms" },
  { name: "down", tip: "M12 5v14M19 12l-7 7-7-7", d: "60ms" },
  { name: "left", tip: "M19 12H5M12 5l-7 7 7 7", d: "120ms" },
  { name: "right", tip: "M5 12h14M12 5l7 7-7 7", d: "180ms" },
] as const;

const LEGEND = [
  {
    name: "Offset",
    desc: "OFFSET[direction] × distance",
    swatch:
      "size-3 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset",
  },
  {
    name: "Blur",
    desc: "blur(10px) → blur(0) when enabled",
    swatch:
      "h-3 w-8 rounded-md bg-[var(--card)] opacity-60 ring-1 ring-fd-border ring-inset",
  },
  {
    name: "Plate",
    desc: "children wrapped in motion.div",
    swatch:
      "h-3 w-8 rounded-md border border-fd-border bg-[var(--card)] ring-1 ring-fd-border ring-inset",
  },
] as const;

export function ScrollRevealAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="direction · distance · blur">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[420px] flex-col items-center gap-9 ${reduced ? "sra-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="flex w-full flex-col items-center gap-6">
            <div className="sra-plate flex h-24 w-40 flex-col items-center justify-center gap-2 rounded-xl border border-fd-border bg-[var(--card)] shadow-sm">
              <span className="h-2 w-16 rounded-full bg-[var(--foreground)]/30" />
              <span className="h-2 w-10 rounded-full bg-[var(--muted)]" />
            </div>

            <div className="grid grid-cols-4 gap-3">
              {DIRS.map((dir) => (
                <div
                  key={dir.name}
                  className="sra-dir flex flex-col items-center gap-1.5"
                  style={{ "--d": dir.d } as CSSProperties}
                >
                  <span className="grid size-9 place-items-center rounded-full bg-[var(--muted)]">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--foreground)"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-4 opacity-60"
                    >
                      <path d={dir.tip} />
                    </svg>
                  </span>
                  <span className="font-mono text-[10px] text-fd-muted-foreground">
                    {dir.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <span className={item.swatch} />
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
