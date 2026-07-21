"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Optional `velocitySkew`: `useVelocity(scrollY)` → spring (same 32/320/0.9)
 * → `useTransform` mapping [-2000, 0, 2000] → [6, 0, -6] degrees of skewY.
 * Disabled under reduced motion.
 */

const CSS = `
@keyframes srv-skew {
  0%, 8%   { transform: skewY(0deg); }
  22%      { transform: skewY(6deg); }
  38%      { transform: skewY(-4deg); }
  55%      { transform: skewY(3deg); }
  72%      { transform: skewY(-2deg); }
  88%, 100%{ transform: skewY(0deg); }
}
@keyframes srv-vel {
  0%, 8%   { transform: scaleX(0.5); }
  22%      { transform: scaleX(1); }
  38%      { transform: scaleX(0.15); }
  55%      { transform: scaleX(0.75); }
  72%      { transform: scaleX(0.3); }
  88%, 100%{ transform: scaleX(0.5); }
}
.srv-plate { animation: srv-skew 3.4s cubic-bezier(0.45,0,0.55,1) infinite; }
.srv-vel   { animation: srv-vel 3.4s cubic-bezier(0.45,0,0.55,1) infinite; }
.srv-static .srv-plate { animation: none; transform: none; }
.srv-static .srv-vel   { animation: none; transform: scaleX(0.5); }
`;

const LEGEND = [
  {
    name: "Velocity",
    desc: "useVelocity(scrollY)",
    swatch: "bg-[var(--foreground)]/40",
  },
  {
    name: "Spring",
    desc: "smoothVelocity · same 32/320/0.9",
    swatch: "bg-[var(--muted)]",
  },
  {
    name: "skewY",
    desc: "mapped to ±6° · clamp true",
    swatch: "bg-[var(--card)] ring-1 ring-fd-border ring-inset",
  },
] as const;

export function ScrollRevealSkew() {
  return (
    <ScrollScene label="Velocity skew" note="scroll velocity → skewY ±6°">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[420px] flex-col items-center gap-8 ${reduced ? "srv-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="flex h-40 w-full items-center justify-center rounded-xl border border-fd-border bg-[var(--card)]">
            <div className="srv-plate flex h-24 w-44 flex-col items-center justify-center gap-2 rounded-xl border border-fd-border bg-[var(--muted)] shadow-sm">
              <span className="h-2 w-16 rounded-full bg-[var(--foreground)]/30" />
              <span className="h-2 w-10 rounded-full bg-[var(--foreground)]/15" />
            </div>
          </div>

          <div className="flex w-full flex-col gap-2">
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-[var(--muted)]">
              <span className="srv-vel absolute inset-y-0 left-0 w-full origin-left rounded-full bg-[var(--foreground)]/55" />
            </div>
            <p className="font-mono text-[11px] text-fd-muted-foreground">
              {"useTransform(smoothVelocity, [-2000,0,2000], [6,0,-6])"}
            </p>
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
