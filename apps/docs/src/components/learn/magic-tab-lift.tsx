"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * The selected tab rides three states, not two: flat rest, lifted selected
 * (`-translate-y-[4px]`), and a deeper focus lift (`-translate-y-[6px]`) once
 * `focus-visible` lands. The rest → selected leg uses the slower settle
 * bezier; selected → focus overshoots on a snappier one — set per-keyframe
 * with `animation-timing-function` so one `animation` carries both legs.
 */
const CSS = `
@keyframes mtl-front {
  0%   { transform: translateY(0);    animation-timing-function: cubic-bezier(0.3,0.7,0.4,1); }
  17%  { transform: translateY(-4px); animation-timing-function: cubic-bezier(0.3,0.7,0.4,1.5); }
  30%  { transform: translateY(-6px); }
  70%  { transform: translateY(-6px); animation-timing-function: cubic-bezier(0.3,0.7,0.4,1.5); }
  83%  { transform: translateY(-4px); animation-timing-function: cubic-bezier(0.3,0.7,0.4,1); }
  100% { transform: translateY(0); }
}
@keyframes mtl-shadow {
  0%   { transform: translateY(2px); opacity: 0.35; animation-timing-function: cubic-bezier(0.3,0.7,0.4,1); }
  17%  { transform: translateY(3px); opacity: 0.55; animation-timing-function: cubic-bezier(0.3,0.7,0.4,1.5); }
  30%  { transform: translateY(4px); opacity: 0.75; }
  70%  { transform: translateY(4px); opacity: 0.75; animation-timing-function: cubic-bezier(0.3,0.7,0.4,1.5); }
  83%  { transform: translateY(3px); opacity: 0.55; animation-timing-function: cubic-bezier(0.3,0.7,0.4,1); }
  100% { transform: translateY(2px); opacity: 0.35; }
}
@keyframes mtl-edge {
  0%, 100% { opacity: 0.4; }
  30%, 70% { opacity: 1; }
}
.mtl-front  { animation: mtl-front 3.6s linear infinite; }
.mtl-shadow { animation: mtl-shadow 3.6s linear infinite; }
.mtl-edge   { animation: mtl-edge 3.6s linear infinite; }
.mtl-static .mtl-front  { animation: none; transform: translateY(-6px); }
.mtl-static .mtl-shadow { animation: none; transform: translateY(4px); opacity: 0.75; }
.mtl-static .mtl-edge   { animation: none; opacity: 1; }
`;

const PHASES: { label: string; dur: string; delta: string }[] = [
  { label: "rest", dur: "—", delta: "0px" },
  { label: "selected", dur: "600ms", delta: "-4px · …,1" },
  { label: "focus", dur: "250ms", delta: "-6px · …,1.5" },
];

export function MagicTabLift() {
  return (
    <ScrollScene label="The lift" note="rest → selected → focus, looped">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex flex-col items-center gap-9 ${reduced ? "mtl-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div className="relative h-11 w-28">
            <span className="mtl-shadow absolute inset-0 rounded-xl bg-black blur-[6px]" />
            <span className="mtl-edge absolute inset-0 rounded-xl bg-[var(--foreground)]/35" />
            <span className="mtl-front absolute inset-0 flex items-center justify-center rounded-xl border border-border bg-[var(--card)]">
              <span className="h-2 w-12 rounded-full bg-[var(--foreground)]/30" />
            </span>
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
