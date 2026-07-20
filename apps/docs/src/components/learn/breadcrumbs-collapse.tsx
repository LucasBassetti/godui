"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * With `maxItems` set, the middle crumbs collapse into a single ellipsis
 * button. Clicking it doesn't navigate — it opens a popover listing the
 * hidden crumbs, springing in on scale + y like every other overlay in the
 * system (`scale: 0.92 → 1`, `y: -4 → 0`).
 */
const HIDDEN = ["w-14", "w-16", "w-12"];

const CSS = `
@keyframes bc-in {
  from { opacity: 0; transform: translateX(-6px); }
  to   { opacity: 1; transform: none; }
}
@keyframes bc-pop {
  0%   { opacity: 0; transform: scale(0.92) translateY(-4px); }
  70%  { opacity: 1; transform: scale(1.01) translateY(0); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
.bc-crumb { opacity: 0; animation: bc-in 420ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.bc-pop   { opacity: 0; animation: bc-pop 480ms cubic-bezier(0.3,0.7,0.4,1.2) 900ms both; }
.bc-static .bc-crumb { opacity: 1; animation: none; transform: none; }
.bc-static .bc-pop   { opacity: 1; animation: none; transform: none; }
`;

function Chevron() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5 text-[var(--foreground)]/30"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function BreadcrumbsCollapse() {
  return (
    <ScrollScene label="Collapsing" note="ellipsis opens a spring popover">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-9 ${reduced ? "bc-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div className="flex items-center gap-0.5">
            <div
              className="bc-crumb flex h-8 items-center gap-1.5 rounded-lg bg-[var(--foreground)]/[0.04] px-2"
              style={{ "--d": "0ms" } as CSSProperties}
            >
              <span className="h-2 w-10 rounded-full bg-[var(--foreground)]/30" />
            </div>
            <span className="flex items-center px-0.5">
              <Chevron />
            </span>

            {/* Ellipsis + its popover, positioned relative so the popover anchors below it. */}
            <div className="relative">
              <div
                className="bc-crumb flex h-8 items-center gap-0.5 rounded-lg bg-[var(--foreground)]/[0.04] px-2.5"
                style={{ "--d": "90ms" } as CSSProperties}
              >
                <span className="size-1 rounded-full bg-[var(--foreground)]/50" />
                <span className="size-1 rounded-full bg-[var(--foreground)]/50" />
                <span className="size-1 rounded-full bg-[var(--foreground)]/50" />
              </div>
              <div className="bc-pop absolute top-full left-0 z-10 mt-1.5 flex min-w-32 origin-top-left flex-col gap-2 rounded-xl border border-fd-border bg-[var(--card)] p-2 shadow-xl">
                {HIDDEN.map((w) => (
                  <span
                    key={w}
                    className={`h-2 ${w} rounded-full bg-[var(--foreground)]/30`}
                  />
                ))}
              </div>
            </div>

            <span className="flex items-center px-0.5">
              <Chevron />
            </span>
            <div
              className="bc-crumb flex h-8 items-center gap-1.5 rounded-lg bg-[var(--muted)] px-2"
              style={{ "--d": "180ms" } as CSSProperties}
            >
              <span className="h-2 w-12 rounded-full bg-[var(--foreground)]/55" />
            </div>
          </div>

          {/* Spacer reserving room for the absolutely-positioned popover below. */}
          <div aria-hidden="true" className="h-20" />

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            popover spring — scale 0.92 → 1, y -4 → 0
          </p>
        </div>
      )}
    </ScrollScene>
  );
}
