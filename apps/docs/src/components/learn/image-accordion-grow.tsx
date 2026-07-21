"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Real component: one `active` index → that panel's `flexGrow` goes to 5,
 * every sibling stays at 1. Shared row width means the outgoing panel
 * compresses as the incoming one expands — same 550ms
 * cubic-bezier(0.22,1,0.36,1) on every panel.
 *
 * Diagram drives that mutual handoff with one parent
 * `grid-template-columns` keyframe (5fr / 1fr slots) so the row always
 * sums to the same width. Per-panel filter tracks the active slot.
 */
const DURATION = "6.4s";
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const CSS = `
@keyframes iag-cols {
  /* panel 0 active */
  0%, 18%   { grid-template-columns: 5fr 1fr 1fr 1fr; }
  /* handoff → panel 1 */
  25%, 43%  { grid-template-columns: 1fr 5fr 1fr 1fr; }
  /* handoff → panel 2 */
  50%, 68%  { grid-template-columns: 1fr 1fr 5fr 1fr; }
  /* handoff → panel 3 */
  75%, 93%  { grid-template-columns: 1fr 1fr 1fr 5fr; }
  100%      { grid-template-columns: 5fr 1fr 1fr 1fr; }
}
@keyframes iag-tone {
  0%, 18%   { filter: saturate(1) brightness(1); }
  25%, 100% { filter: saturate(0.45) brightness(0.72); }
}
@keyframes iag-tone-1 {
  0%, 18%   { filter: saturate(0.45) brightness(0.72); }
  25%, 43%  { filter: saturate(1) brightness(1); }
  50%, 100% { filter: saturate(0.45) brightness(0.72); }
}
@keyframes iag-tone-2 {
  0%, 43%   { filter: saturate(0.45) brightness(0.72); }
  50%, 68%  { filter: saturate(1) brightness(1); }
  75%, 100% { filter: saturate(0.45) brightness(0.72); }
}
@keyframes iag-tone-3 {
  0%, 68%   { filter: saturate(0.45) brightness(0.72); }
  75%, 93%  { filter: saturate(1) brightness(1); }
  100%      { filter: saturate(0.45) brightness(0.72); }
}
@keyframes iag-cap {
  0%, 18%   { opacity: 1; transform: translateY(0); }
  22%, 100% { opacity: 0; transform: translateY(8px); }
}
@keyframes iag-cap-1 {
  0%, 22%   { opacity: 0; transform: translateY(8px); }
  25%, 43%  { opacity: 1; transform: translateY(0); }
  47%, 100% { opacity: 0; transform: translateY(8px); }
}
@keyframes iag-cap-2 {
  0%, 47%   { opacity: 0; transform: translateY(8px); }
  50%, 68%  { opacity: 1; transform: translateY(0); }
  72%, 100% { opacity: 0; transform: translateY(8px); }
}
@keyframes iag-cap-3 {
  0%, 72%   { opacity: 0; transform: translateY(8px); }
  75%, 93%  { opacity: 1; transform: translateY(0); }
  97%, 100% { opacity: 0; transform: translateY(8px); }
}
.iag-row { display: grid; gap: 0.5rem; animation: iag-cols ${DURATION} ${EASE} infinite; }
.iag-p0 { animation: iag-tone ${DURATION} ${EASE} infinite; }
.iag-p1 { animation: iag-tone-1 ${DURATION} ${EASE} infinite; }
.iag-p2 { animation: iag-tone-2 ${DURATION} ${EASE} infinite; }
.iag-p3 { animation: iag-tone-3 ${DURATION} ${EASE} infinite; }
.iag-c0 { animation: iag-cap ${DURATION} ${EASE} infinite; }
.iag-c1 { animation: iag-cap-1 ${DURATION} ${EASE} infinite; }
.iag-c2 { animation: iag-cap-2 ${DURATION} ${EASE} infinite; }
.iag-c3 { animation: iag-cap-3 ${DURATION} ${EASE} infinite; }
.iag-static .iag-row { animation: none; grid-template-columns: 5fr 1fr 1fr 1fr; }
.iag-static .iag-p0 { animation: none; filter: saturate(1) brightness(1); }
.iag-static .iag-p1,
.iag-static .iag-p2,
.iag-static .iag-p3 { animation: none; filter: saturate(0.45) brightness(0.72); }
.iag-static .iag-c0 { animation: none; opacity: 1; transform: none; }
.iag-static .iag-c1,
.iag-static .iag-c2,
.iag-static .iag-c3 { animation: none; opacity: 0; transform: translateY(8px); }
`;

const PANELS = [
  { tone: "iag-p0", cap: "iag-c0" },
  { tone: "iag-p1", cap: "iag-c1" },
  { tone: "iag-p2", cap: "iag-c2" },
  { tone: "iag-p3", cap: "iag-c3" },
] as const;

export function ImageAccordionGrow() {
  return (
    <ScrollScene label="The grow" note="one grows · the rest compress">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[480px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div key={cycle} className={`w-full ${reduced ? "iag-static" : ""}`}>
            <div className="iag-row h-44 w-full">
              {PANELS.map((p, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: fixed panel set
                  key={i}
                  className={`relative min-w-0 overflow-hidden rounded-2xl bg-[var(--foreground)]/40 ${p.tone}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  {/* Active caption stand-in — token bars only. */}
                  <div
                    className={`absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-3 ${p.cap}`}
                    style={{ transformOrigin: "bottom" } as CSSProperties}
                  >
                    <span className="h-px w-6 bg-white/70" />
                    <span className="h-1.5 w-10 rounded-full bg-white/90" />
                    <span className="h-1 w-8 rounded-full bg-white/50" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--foreground)]/35 ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Idle panels
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                flexGrow: 1 — share the leftover space
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--foreground)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Active panel
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                flexGrow: 5 · 550ms cubic-bezier(0.22,1,0.36,1)
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
