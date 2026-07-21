"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * `AnimatePresence mode="popLayout"` means a removed avatar leaves the
 * layout the instant it's gone — the siblings after it don't wait for its
 * exit animation before sliding into its place, they move immediately.
 * Every avatar (entering, leaving, or just shifting to fill a gap) shares
 * the same `{ stiffness: 520, damping: 32 }` spring, so a leave-and-shift
 * and a fresh join both settle at the same speed. Faked here as one avatar
 * leaving mid-row (its neighbors shift left to close the gap), then a new
 * one joining at the end.
 */
const CSS = `
@keyframes pfe-leaver {
  0%, 8%    { opacity: 1; transform: scale(1); }
  20%, 46%  { opacity: 0; transform: scale(0.4); }
  58%, 100% { opacity: 1; transform: scale(1); }
}
@keyframes pfe-shift {
  0%, 8%    { transform: translateX(0); }
  20%, 46%  { transform: translateX(-36px); }
  58%, 100% { transform: translateX(0); }
}
@keyframes pfe-joiner {
  0%, 70%   { opacity: 0; transform: scale(0.5) translateX(-8px); }
  82%, 94%  { opacity: 1; transform: scale(1) translateX(0); }
  100%      { opacity: 0; transform: scale(0.5) translateX(-8px); }
}
.pfe-leaver { animation: pfe-leaver 6.4s cubic-bezier(0.34,1.4,0.64,1) infinite; }
.pfe-shift  { animation: pfe-shift 6.4s cubic-bezier(0.34,1.4,0.64,1) infinite; }
.pfe-joiner { animation: pfe-joiner 6.4s cubic-bezier(0.34,1.4,0.64,1) infinite; }
.pfe-static .pfe-leaver { animation: none; opacity: 1; transform: none; }
.pfe-static .pfe-shift  { animation: none; transform: none; }
.pfe-static .pfe-joiner { animation: none; opacity: 0; transform: scale(0.5) translateX(-8px); }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Leave",
    desc: "popLayout removes it immediately, opacity/scale down",
    swatch: "bg-[var(--foreground)]/25",
  },
  {
    name: "Reflow",
    desc: "siblings shift on the same spring — a transform, not a resize",
    swatch: "bg-[var(--foreground)]/40",
  },
  {
    name: "Join",
    desc: "enters from opacity 0, scale 0.5, x -8",
    swatch: "bg-[var(--muted)]",
  },
];

export function PresenceFacepileEnter() {
  return (
    <ScrollScene label="Join and leave" note="popLayout · one spring for both">
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[380px] flex-col items-center gap-9 ${
            reduced ? "pfe-static" : ""
          }`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div key={cycle} className="flex h-11 items-center -space-x-2">
            <span className="size-11 shrink-0 rounded-full bg-[var(--muted)] ring-2 ring-background" />
            <span className="pfe-leaver size-11 shrink-0 rounded-full bg-[var(--muted)] ring-2 ring-background" />
            <span className="pfe-shift size-11 shrink-0 rounded-full bg-[var(--muted)] ring-2 ring-background" />
            <span className="pfe-shift size-11 shrink-0 rounded-full bg-[var(--muted)] ring-2 ring-background" />
            <span className="pfe-joiner size-11 shrink-0 rounded-full bg-[var(--foreground)]/30 ring-2 ring-background" />
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            {'{ type: "spring", stiffness: 520, damping: 32 }'}
          </p>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
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
