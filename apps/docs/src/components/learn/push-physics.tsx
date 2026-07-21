"use client";

import { ScrollScene } from "./scroll-scene";

// One full interaction cycle: rest → hover-lift → press-dip → rest, looped.
// Face and shadow are driven by the same timeline so they move together.
const CSS = `
@keyframes pp-face {
  0%, 12%   { transform: translateY(-4px); }
  34%, 50%  { transform: translateY(-6px); }
  62%, 72%  { transform: translateY(-2px); }
  88%, 100% { transform: translateY(-4px); }
}
@keyframes pp-shadow {
  0%, 12%   { transform: translateY(2px); opacity: .4; }
  34%, 50%  { transform: translateY(4px); opacity: .5; }
  62%, 72%  { transform: translateY(1px); opacity: .3; }
  88%, 100% { transform: translateY(2px); opacity: .4; }
}
.pp-face   { animation: pp-face 3.6s cubic-bezier(0.3,0.7,0.4,1.2) infinite; }
.pp-shadow { animation: pp-shadow 3.6s cubic-bezier(0.3,0.7,0.4,1.2) infinite; }
.pp-static .pp-face   { animation: none; transform: translateY(-4px); }
.pp-static .pp-shadow { animation: none; transform: translateY(2px); opacity: .4; }
`;

const PHASES: { label: string; dur: string; delta: string }[] = [
  { label: "rest", dur: "600ms", delta: "face -4px" },
  { label: "hover", dur: "250ms", delta: "face -6px" },
  { label: "press", dur: "34ms", delta: "face -2px" },
];

export function PushPhysics() {
  return (
    <ScrollScene label="Push physics" note="translate-y, springy bezier">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex flex-col items-center gap-9 ${reduced ? "pp-static" : ""}`}
        >
          <div className="relative h-[64px] w-[150px]">
            <span className="pp-shadow absolute inset-0 rounded-xl bg-black blur-[4px]" />
            <span className="absolute inset-0 rounded-xl bg-zinc-500 dark:bg-zinc-600" />
            <span className="pp-face absolute inset-0 flex items-center justify-center rounded-xl bg-primary font-semibold text-[13px] text-primary-foreground">
              Push me
            </span>
          </div>
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
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
