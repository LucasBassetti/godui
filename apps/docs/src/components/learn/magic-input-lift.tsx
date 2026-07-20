"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * The focus lift, front-on and looped: at rest the field is flat (shadow and
 * edge hidden). On focus the front translates up, the shadow drops + fades in
 * + blurs, and the edge fades in — pure transform/opacity, no layout. Front
 * uses a springy overshoot bezier; the shadow/edge ride a slower settle.
 */
const CSS = `
@keyframes mil-front {
  0%, 14%   { transform: translateY(0); }
  46%, 60%  { transform: translateY(-6px); }
  92%, 100% { transform: translateY(0); }
}
@keyframes mil-shadow {
  0%, 14%   { transform: translateY(0); opacity: 0; }
  46%, 60%  { transform: translateY(6px); opacity: 0.7; }
  92%, 100% { transform: translateY(0); opacity: 0; }
}
@keyframes mil-edge {
  0%, 14%   { opacity: 0; }
  46%, 60%  { opacity: 1; }
  92%, 100% { opacity: 0; }
}
.mil-front  { animation: mil-front 4s cubic-bezier(0.3,0.7,0.4,1.5) infinite; }
.mil-shadow { animation: mil-shadow 4s cubic-bezier(0.3,0.7,0.4,1) infinite; }
.mil-edge   { animation: mil-edge 4s ease infinite; }
.mil-static .mil-front  { animation: none; transform: translateY(-6px); }
.mil-static .mil-shadow { animation: none; transform: translateY(6px); opacity: 0.7; }
.mil-static .mil-edge   { animation: none; opacity: 1; }
`;

const PHASES: { label: string; dur: string; prop: string }[] = [
  { label: "front", dur: "250ms", prop: "translateY -6px" },
  { label: "edge", dur: "250ms", prop: "opacity 0 → 1" },
  { label: "shadow", dur: "600ms", prop: "drop + blur + fade" },
];

export function MagicInputLift() {
  return (
    <ScrollScene
      label="The lift"
      note="focus-within · transform + opacity only"
    >
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[440px] flex-col items-center gap-9 ${reduced ? "mil-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div className="relative h-[64px] w-[240px]">
            <span className="mil-shadow absolute inset-0 rounded-xl bg-black blur-[8px]" />
            <span className="mil-edge absolute inset-0 rounded-xl bg-[var(--muted)]" />
            <span className="mil-front absolute inset-0 flex items-center rounded-xl border border-border bg-[var(--card)] px-4">
              <span className="h-2 w-20 rounded-full bg-[var(--foreground)]/25" />
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
              <dd key={p.label}>{p.prop}</dd>
            ))}
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
