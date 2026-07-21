"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Side-by-side: raw scroll progress vs the SPRING.smooth wrap
 * (stiffness 320, damping 32, mass 0.9). The soft primary glow is the real
 * drop-shadow filter — color is the subject here.
 */
const PATH = "M16 48 C 90 48, 120 20, 200 20 S 260 28, 284 28";

const CSS = `
@keyframes bdg-raw {
  0%, 8%    { stroke-dashoffset: 1; }
  42%, 58%  { stroke-dashoffset: 0; }
  92%, 100% { stroke-dashoffset: 1; }
}
.bdg-raw { animation: bdg-raw 2.8s linear infinite; }

@keyframes bdg-spring {
  0%, 8%     { stroke-dashoffset: 1; }
  48%, 62%   { stroke-dashoffset: 0; }
  100%       { stroke-dashoffset: 1; }
}
.bdg-spring { animation: bdg-spring 2.8s cubic-bezier(0.22, 1, 0.36, 1) infinite; }

@keyframes bdg-glow {
  0%, 8%     { opacity: 0.15; filter: drop-shadow(0 0 0 transparent); }
  48%, 62%   { opacity: 1; filter: drop-shadow(0 0 8px color-mix(in oklch, var(--primary) 50%, transparent)); }
  100%       { opacity: 0.15; filter: drop-shadow(0 0 0 transparent); }
}
.bdg-glow { animation: bdg-glow 2.8s cubic-bezier(0.22, 1, 0.36, 1) infinite; }

@keyframes bdg-plate {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
.bdg-plate { animation: bdg-plate 480ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }

.bdg-static .bdg-raw,
.bdg-static .bdg-spring { animation: none; stroke-dashoffset: 0; }
.bdg-static .bdg-glow {
  animation: none;
  opacity: 1;
  filter: drop-shadow(0 0 8px color-mix(in oklch, var(--primary) 50%, transparent));
}
.bdg-static .bdg-plate { animation: none; opacity: 1; transform: none; }
`;

const LEGEND = [
  {
    name: "Raw map",
    desc: "useTransform alone — hard edges at 0.1 / 0.8",
    swatch: "bg-[var(--muted)]",
  },
  {
    name: "Spring",
    desc: "useSpring({ stiffness: 320, damping: 32, mass: 0.9 })",
    swatch: "bg-[var(--foreground)]/40",
  },
  {
    name: "Glow",
    desc: "drop-shadow with color-mix(primary 50%, transparent)",
    swatch: "bg-[var(--primary)]/50",
  },
] as const;

function PathRow({
  className,
  glow,
  delay,
}: {
  className: string;
  glow?: boolean;
  delay: string;
}) {
  return (
    <div
      className="bdg-plate flex flex-col gap-2 rounded-xl border border-fd-border bg-[var(--card)]/60 p-3"
      style={{ "--d": delay } as CSSProperties}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 300 64"
        fill="none"
        className={`w-full overflow-visible ${glow ? "bdg-glow" : ""}`}
      >
        <path
          d={PATH}
          stroke="var(--foreground)"
          strokeOpacity={0.12}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <path
          className={className}
          d={PATH}
          stroke={glow ? "var(--primary)" : "var(--foreground)"}
          strokeOpacity={glow ? 1 : 0.65}
          strokeWidth={2.5}
          strokeLinecap="round"
          pathLength={1}
          style={{ strokeDasharray: 1 }}
        />
      </svg>
    </div>
  );
}

export function BeamDrawSpring() {
  return (
    <ScrollScene label="Spring + glow" note="stiffness 320 · damping 32">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[400px] flex-col items-center gap-9 ${reduced ? "bdg-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="flex w-full flex-col gap-3">
            <PathRow className="bdg-raw" delay="0ms" />
            <PathRow className="bdg-spring" glow delay="120ms" />
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
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
