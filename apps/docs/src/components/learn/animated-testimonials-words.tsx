"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * The quote isn't one fade-in — it's split into `motion.span` per word, each
 * with the same `blur(6px) → blur(0)`, `y: 6 → 0`, `opacity: 0 → 1` entrance,
 * offset by `delay: 0.02 * i`. Real playback is fast (20ms between words);
 * slowed down here so the cascade reads clearly.
 */
const TOKENS_WIDTH = [22, 15, 28, 18, 24, 12, 20, 16];

const CSS = `
@keyframes tw-word {
  0%       { opacity: 0; filter: blur(6px); transform: translateY(6px); }
  12%      { opacity: 1; filter: blur(0); transform: translateY(0); }
  76%, 88% { opacity: 1; filter: blur(0); transform: translateY(0); }
  96%, 100%{ opacity: 0; filter: blur(3px); transform: translateY(-6px); }
}
.tw-word { animation: tw-word 3.6s ease var(--d) infinite; }
.tw-static .tw-word { animation: none; opacity: 1; filter: none; transform: none; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Per-word entrance",
    desc: "blur 6px → 0 · y 6px → 0 · opacity 0 → 1",
    swatch: "bg-[var(--foreground)]/30",
  },
  {
    name: "Stagger",
    desc: "delay: 0.02 × word index",
    swatch: "bg-[var(--foreground)]/60",
  },
];

export function AnimatedTestimonialsWords() {
  return (
    <ScrollScene label="The reveal" note="one span per word · staggered blur">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[420px] flex-col items-center gap-9 ${
            reduced ? "tw-static" : ""
          }`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="flex flex-wrap gap-x-2 gap-y-2.5 rounded-xl border border-dashed border-fd-border p-5">
            {TOKENS_WIDTH.map((w, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed word-position row
                key={i}
                className="tw-word h-2.5 rounded-full bg-[var(--foreground)]/30"
                style={
                  {
                    width: `${w * 4}px`,
                    "--d": `${i * 90}ms`,
                  } as CSSProperties
                }
              />
            ))}
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            {"transition={{ duration: 0.2, delay: 0.02 * i }}"}
          </p>

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
