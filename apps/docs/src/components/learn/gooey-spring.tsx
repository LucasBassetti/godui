"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * One open → close cycle matching the component's spring feel: satellites
 * stagger out on open (i * 40ms) and reverse-stagger on close. Trigger plus
 * rotates 135° into a cross.
 */
const CSS = `
@keyframes gs-trigger {
  0%, 10%   { transform: rotate(0deg); }
  28%, 62%  { transform: rotate(135deg); }
  80%, 100% { transform: rotate(0deg); }
}
@keyframes gs-sat-0 {
  0%, 10%   { transform: translateY(0) scale(0.2); opacity: 0; }
  28%, 62%  { transform: translateY(-58px) scale(1); opacity: 1; }
  80%, 100% { transform: translateY(0) scale(0.2); opacity: 0; }
}
@keyframes gs-sat-1 {
  0%, 12%   { transform: translateY(0) scale(0.2); opacity: 0; }
  32%, 62%  { transform: translateY(-116px) scale(1); opacity: 1; }
  78%, 100% { transform: translateY(0) scale(0.2); opacity: 0; }
}
@keyframes gs-sat-2 {
  0%, 14%   { transform: translateY(0) scale(0.2); opacity: 0; }
  36%, 62%  { transform: translateY(-174px) scale(1); opacity: 1; }
  76%, 100% { transform: translateY(0) scale(0.2); opacity: 0; }
}
.gs-trigger { animation: gs-trigger 3.8s cubic-bezier(0.3, 0.7, 0.4, 1.2) infinite; }
.gs-sat-0   { animation: gs-sat-0 3.8s cubic-bezier(0.3, 0.7, 0.4, 1.2) infinite; }
.gs-sat-1   { animation: gs-sat-1 3.8s cubic-bezier(0.3, 0.7, 0.4, 1.2) infinite; }
.gs-sat-2   { animation: gs-sat-2 3.8s cubic-bezier(0.3, 0.7, 0.4, 1.2) infinite; }
.gs-static .gs-trigger { animation: none; transform: rotate(135deg); }
.gs-static .gs-sat-0,
.gs-static .gs-sat-1,
.gs-static .gs-sat-2 {
  animation: none;
  opacity: 1;
  transform: translateY(var(--ty)) scale(1);
}
`;

const PHASES: { label: string; value: string }[] = [
  { label: "spring", value: "170 / 12 / 0.1" },
  { label: "open delay", value: "i × 40ms" },
  { label: "close delay", value: "(n−i) × 20ms" },
];

export function GooeySpring() {
  return (
    <ScrollScene label="Spring extrusion" note="staggered open / reverse close">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex flex-col items-center gap-8 ${reduced ? "gs-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="relative flex h-[240px] w-[80px] items-end justify-center pb-2">
            <div
              className="gs-sat-2 absolute bottom-2 size-9 rounded-full bg-black/40"
              style={{ "--ty": "-174px" } as CSSProperties}
            />
            <div
              className="gs-sat-1 absolute bottom-2 size-9 rounded-full bg-black/45"
              style={{ "--ty": "-116px" } as CSSProperties}
            />
            <div
              className="gs-sat-0 absolute bottom-2 size-9 rounded-full bg-black/50"
              style={{ "--ty": "-58px" } as CSSProperties}
            />
            <div className="relative z-10 flex size-14 items-center justify-center rounded-full border border-white/10 bg-[var(--card)] shadow-md">
              <span className="gs-trigger flex size-full items-center justify-center font-semibold text-[20px] text-fd-foreground leading-none">
                +
              </span>
            </div>
          </div>

          <dl className="grid grid-cols-3 gap-x-6 gap-y-1 text-center font-mono text-[11px] text-fd-muted-foreground">
            {PHASES.map((p) => (
              <dt key={p.label} className="text-fd-foreground">
                {p.label}
              </dt>
            ))}
            {PHASES.map((p) => (
              <dd key={p.label}>{p.value}</dd>
            ))}
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
