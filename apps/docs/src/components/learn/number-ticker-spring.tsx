"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Count-up as a settling cascade: five digit-slots grow via scaleY with a
 * spring-ish overshoot, staggered so the "value" feels like it's climbing
 * toward rest. Compositor-only (transform + opacity). Loops after scroll-in.
 */
const CSS = `
@keyframes nts-bar {
  0%, 8%   { transform: scaleY(0.12); opacity: 0.25; }
  42%      { transform: scaleY(1.08); opacity: 1; }
  58%      { transform: scaleY(0.94); opacity: 0.9; }
  72%, 88% { transform: scaleY(1);    opacity: 1; }
  100%     { transform: scaleY(0.12); opacity: 0.25; }
}
@keyframes nts-fade {
  0%, 6%   { opacity: 0; transform: translateY(6px); }
  18%, 82% { opacity: 1; transform: translateY(0); }
  94%, 100%{ opacity: 0; transform: translateY(-4px); }
}
.nts-bar {
  transform-origin: bottom center;
  animation: nts-bar 3.2s cubic-bezier(0.22, 1.2, 0.36, 1) infinite;
  animation-delay: var(--bd);
}
.nts-row { animation: nts-fade 3.2s ease infinite; }
.nts-static .nts-bar { animation: none; opacity: 1; transform: scaleY(1); }
.nts-static .nts-row { animation: none; opacity: 1; transform: none; }
`;

const HEIGHTS = [28, 44, 62, 78, 92];

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "overshoot",
    desc: "scaleY past 1, then settle — spring feel",
    swatch: "bg-[var(--foreground)]/40",
  },
  {
    name: "stagger",
    desc: "each slot delayed 90ms — digits cascade in",
    swatch: "bg-[var(--foreground)]/70",
  },
  {
    name: "defaults",
    desc: "damping 60 · stiffness 100",
    swatch: "bg-[var(--foreground)]",
  },
];

export function NumberTickerSpring() {
  return (
    <ScrollScene label="The motion" note="spring count-up · settle cascade">
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[400px] flex-col items-center gap-9 ${reduced ? "nts-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div key={cycle} className="nts-row flex flex-col items-center gap-4">
            <div
              className="flex h-[112px] items-end justify-center gap-2.5 rounded-xl border border-fd-border bg-[var(--muted)]/30 px-8 pb-4 pt-6"
              aria-hidden="true"
            >
              {HEIGHTS.map((h, i) => (
                <span
                  key={h}
                  className="nts-bar w-3 rounded-sm bg-[var(--foreground)]/65"
                  style={
                    {
                      height: `${h}px`,
                      "--bd": `${i * 90}ms`,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
            <p className="font-mono text-[11px] text-fd-muted-foreground">
              {"useSpring(motionValue, { damping: 60, stiffness: 100 })"}
            </p>
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
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
