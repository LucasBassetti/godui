"use client";

import { ScrollScene } from "./scroll-scene";

// One full press cycle: rest → squash (fast) → overshoot stretch → settle,
// looped. Only `transform: scale` animates, from the bottom edge, so the plate
// squashes down into its baseline and springs back past its rest height.
const CSS = `
@keyframes js-press {
  0%, 18%   { transform: scale(1, 1); }
  30%, 42%  { transform: scale(1.13, 0.87); }
  56%       { transform: scale(0.97, 1.06); }
  70%       { transform: scale(1.02, 0.98); }
  84%, 100% { transform: scale(1, 1); }
}
.js-plate { animation: js-press 3.4s cubic-bezier(0.3,0.7,0.4,1.2) infinite; }
.js-static .js-plate { animation: none; transform: scale(1, 1); }
`;

const PHASES: { label: string; dur: string; delta: string }[] = [
  { label: "rest", dur: "—", delta: "scale 1 · 1" },
  { label: "press", dur: "120ms", delta: "scale 1.13 · 0.87" },
  { label: "release", dur: "300ms", delta: "overshoot → settle" },
];

export function JellySquash() {
  return (
    <ScrollScene
      label="Squash & stretch"
      note="transform: scale, origin bottom, back easing"
    >
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex flex-col items-center gap-9 ${reduced ? "js-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div className="flex h-[96px] items-end">
            <div className="js-plate flex h-12 w-36 origin-bottom items-center justify-center rounded-xl bg-[var(--foreground)]">
              <div className="h-2 w-12 rounded-full bg-[var(--background)]/80" />
            </div>
          </div>
          <dl className="grid grid-cols-3 gap-x-8 gap-y-1 text-center font-mono text-[11px] text-fd-muted-foreground">
            {PHASES.map((p) => (
              <dt key={p.label} className="text-fd-foreground">
                {p.label}
              </dt>
            ))}
            {PHASES.map((p) => (
              <dd key={p.label}>{p.dur}</dd>
            ))}
            {PHASES.map((p) => (
              <dd key={p.label}>{p.delta}</dd>
            ))}
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
