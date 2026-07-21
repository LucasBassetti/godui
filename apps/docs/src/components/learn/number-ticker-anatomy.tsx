"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * The ticker is a three-stage pipeline: a raw MotionValue holds the target,
 * useSpring smooths it (damping 60 / stiffness 100), and a change listener
 * writes Intl.NumberFormat text into the span. Plates are token blocks —
 * digit stand-ins are gray bars / monospace glyphs, never fake UI numbers.
 */
const CSS = `
@keyframes nta-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes nta-pulse {
  0%, 100% { opacity: 0.35; transform: scaleY(0.55); }
  45%      { opacity: 1;    transform: scaleY(1); }
  70%      { opacity: 0.7;  transform: scaleY(0.85); }
}
.nta-stage {
  opacity: 0;
  animation: nta-in 700ms cubic-bezier(0.3, 0.7, 0.4, 1.2) var(--d) both;
}
.nta-glyph {
  transform-origin: bottom center;
  animation: nta-pulse 2.4s cubic-bezier(0.3, 0.7, 0.4, 1) infinite;
  animation-delay: var(--gd);
}
.nta-static .nta-stage { opacity: 1; animation: none; transform: none; }
.nta-static .nta-glyph { animation: none; opacity: 1; transform: none; }
`;

const STAGES: {
  name: string;
  desc: string;
  caption: string;
  delay: string;
  swatch: string;
}[] = [
  {
    name: "motionValue",
    desc: "raw target — set once in view",
    caption: "useMotionValue",
    delay: "0ms",
    swatch: "bg-[var(--foreground)]/25",
  },
  {
    name: "spring",
    desc: "damping 60 · stiffness 100",
    caption: "useSpring",
    delay: "120ms",
    swatch: "bg-[var(--foreground)]/55",
  },
  {
    name: "formatted span",
    desc: "Intl.NumberFormat → textContent",
    caption: 'on("change")',
    delay: "240ms",
    swatch: "bg-[var(--foreground)]",
  },
];

function GlyphStack() {
  return (
    <div
      className="flex h-14 items-end justify-center gap-1 tracking-wider"
      aria-hidden="true"
    >
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="nta-glyph inline-block w-2 rounded-sm bg-[var(--foreground)]/50"
          style={
            {
              height: `${10 + i * 6}px`,
              "--gd": `${i * 80}ms`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

export function NumberTickerAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="motionValue → spring → span">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[560px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className={`flex w-full flex-col items-center gap-4 sm:flex-row sm:items-stretch sm:justify-between ${reduced ? "nta-static" : ""}`}
          >
            {STAGES.map((stage, i) => (
              <div
                key={stage.name}
                className="flex items-center gap-3 sm:contents"
              >
                <div
                  className="nta-stage flex w-full max-w-[140px] flex-col items-center gap-3 sm:max-w-none sm:flex-1"
                  style={{ "--d": stage.delay } as CSSProperties}
                >
                  <div className="flex h-[88px] w-full flex-col items-center justify-center gap-2 rounded-xl border border-fd-border bg-[var(--muted)]/40 px-3">
                    <GlyphStack />
                    <span
                      className={`h-1.5 w-10 rounded-full ${stage.swatch}`}
                    />
                  </div>
                  <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
                    {stage.caption}
                  </p>
                </div>
                {i < STAGES.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="nta-stage hidden h-px w-6 shrink-0 bg-[var(--foreground)]/25 sm:mt-10 sm:block sm:h-0.5 sm:self-start"
                    style={{ "--d": `${80 + i * 120}ms` } as CSSProperties}
                  />
                ) : null}
              </div>
            ))}
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            {STAGES.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <span
                  className={`h-1.5 w-8 rounded-full ring-1 ring-fd-border ring-inset ${item.swatch}`}
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
