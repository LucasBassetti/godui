"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * `AnimatePresence` runs one spring for both directions, just with different
 * endpoints. In: `opacity 0→1`, `scale 0.96→1`, `y -8→0`, `blur(8px)→blur(0)`
 * on `{ stiffness: 320, damping: 32, mass: 0.9 }`. Out: the same spring back
 * to `scale 0.97`, `y -6`, `blur(6px)` — a shorter throw, so the exit reads
 * as a quick settle rather than a mirrored replay of the entrance.
 */
const CSS = `
@keyframes cpe-panel {
  0%        { opacity: 0; transform: scale(0.96) translateY(-8px); filter: blur(8px); }
  24%, 68%  { opacity: 1; transform: scale(1) translateY(0px); filter: blur(0px); }
  92%, 100% { opacity: 0; transform: scale(0.97) translateY(-6px); filter: blur(6px); }
}
@keyframes cpe-backdrop {
  0%        { opacity: 0; }
  20%, 72%  { opacity: 1; }
  94%, 100% { opacity: 0; }
}
.cpe-panel    { animation: cpe-panel 4.4s cubic-bezier(0.34,1.56,0.64,1) infinite; }
.cpe-backdrop { animation: cpe-backdrop 4.4s ease infinite; }
.cpe-static .cpe-panel    { animation: none; opacity: 1; transform: none; filter: none; }
.cpe-static .cpe-backdrop { animation: none; opacity: 1; }
`;

const PHASES: { label: string; dur: string; delta: string }[] = [
  { label: "enter", dur: "spring", delta: "scale .96 → 1, blur 8 → 0" },
  { label: "hold", dur: "—", delta: "settled, opacity 1" },
  { label: "exit", dur: "spring", delta: "scale .97, blur 6px" },
];

export function CommandPaletteEnter() {
  return (
    <ScrollScene
      label="Enter / exit"
      note="stiffness 320 · damping 32 · mass 0.9"
    >
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex flex-col items-center gap-9 ${reduced ? "cpe-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="relative flex h-52 w-72 items-start justify-center rounded-xl border border-fd-border border-dashed bg-[var(--foreground)]/[0.04] pt-6">
            <span className="cpe-backdrop absolute inset-0 rounded-xl bg-[var(--foreground)]/[0.06]" />
            <div className="cpe-panel relative w-56 rounded-2xl border border-border bg-card p-3 shadow-2xl">
              <div className="mb-2.5 h-2 w-24 rounded-full bg-[var(--foreground)]/25" />
              <div className="space-y-1.5">
                <div className="h-6 rounded-lg bg-[var(--foreground)]/[0.07]" />
                <div className="h-6 rounded-lg" />
                <div className="h-6 rounded-lg" />
              </div>
            </div>
          </div>

          <dl className="grid grid-cols-3 gap-x-6 gap-y-1 text-center font-mono text-[11px] text-fd-muted-foreground">
            {PHASES.map((p) => (
              <dt key={p.label} className="text-fd-foreground">
                {p.label}
              </dt>
            ))}
            {PHASES.map((p) => (
              <dd key={`${p.label}-dur`}>{p.dur}</dd>
            ))}
            {PHASES.map((p) => (
              <dd key={`${p.label}-delta`}>{p.delta}</dd>
            ))}
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
