"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Two things happen on hover, and neither touches layout or paint: the card
 * itself `translate`s up 4px over 300ms (`cubic-bezier(0.3,0.7,0.4,1)`), and a
 * radial-gradient glow — pinned to `--x`/`--y`, written on every
 * `onPointerMove` — fades to `opacity: 1`. This loop fakes a pointer sweeping
 * the card by translating a small blurred dot across it instead of animating
 * the gradient's position directly, so the whole thing stays on the
 * compositor.
 */
const CSS = `
@keyframes bgg-lift { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
@keyframes bgg-sweep {
  0%   { transform: translate(-64px, -34px); opacity: 0; }
  15%  { opacity: 1; }
  85%  { opacity: 1; }
  100% { transform: translate(64px, 34px); opacity: 0; }
}
.bgg-card { animation: bgg-lift 3.2s cubic-bezier(0.3,0.7,0.4,1) infinite; }
.bgg-glow { animation: bgg-sweep 3.2s cubic-bezier(0.3,0.7,0.4,1) infinite; }
.bgg-static .bgg-card { animation: none; transform: none; }
.bgg-static .bgg-glow { animation: none; opacity: 0; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Lift",
    desc: "translate -4px, 300ms cubic-bezier(0.3,0.7,0.4,1)",
    swatch: "bg-[var(--card)]",
  },
  {
    name: "Spotlight",
    desc: "radial-gradient at --x/--y, opacity 0→1",
    swatch: "bg-[var(--foreground)]/40",
  },
];

export function BentoGridGlow() {
  return (
    <ScrollScene label="The glow" note="pointer position → --x/--y">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[380px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`relative flex h-40 w-full items-center justify-center overflow-hidden rounded-xl border border-fd-border bg-[var(--card)] shadow-sm ${
              reduced ? "bgg-static" : "bgg-card"
            }`}
          >
            <span className="bgg-glow pointer-events-none absolute size-24 rounded-full bg-[var(--foreground)]/25 blur-2xl" />
            <span className="relative h-2 w-16 rounded-full bg-[var(--foreground)]/30" />
          </div>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
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
