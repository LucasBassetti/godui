"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * The rAF loop never re-renders React — it lerps `current` toward `target`
 * with factor 0.12 and writes `scale` onto the feDisplacementMap element.
 * This scene visualizes that ease as a fill bar chasing a dashed target.
 */
const CSS = `
@keyframes lil-fill {
  0%, 8%   { transform: scaleX(0.02); }
  35%      { transform: scaleX(0.42); }
  55%      { transform: scaleX(0.55); }
  72%      { transform: scaleX(0.78); }
  88%, 100%{ transform: scaleX(0.9); }
}
@keyframes lil-target {
  0%, 8%   { transform: translateX(0); opacity: 0.4; }
  20%      { transform: translateX(0); opacity: 1; }
  35%      { transform: translateX(118px); }
  55%      { transform: translateX(148px); }
  72%      { transform: translateX(210px); }
  88%, 100%{ transform: translateX(242px); opacity: 1; }
}
@keyframes lil-pulse {
  0%, 100% { opacity: 0.35; }
  50%      { opacity: 1; }
}
.lil-fill   { animation: lil-fill 3.6s cubic-bezier(0.25,0.1,0.25,1) infinite; transform-origin: left center; }
.lil-target { animation: lil-target 3.6s cubic-bezier(0.25,0.1,0.25,1) infinite; }
.lil-dot    { animation: lil-pulse 1.2s ease-in-out infinite; }
.lil-static .lil-fill   { animation: none; transform: scaleX(0.9); }
.lil-static .lil-target { animation: none; transform: translateX(242px); opacity: 1; }
.lil-static .lil-dot    { animation: none; opacity: 1; }
`;

const LEGEND = [
  {
    name: "current",
    desc: "lerp: current += (target − current) × 0.12",
    kind: "current" as const,
  },
  {
    name: "target",
    desc: "hover / always / velocity write here",
    kind: "target" as const,
  },
  {
    name: "setAttribute",
    desc: "scale written on dispRef — no setState",
    kind: "tick" as const,
  },
] as const;

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "target") {
    return (
      <span className="relative flex h-4 w-8 items-end justify-center">
        <span className="h-3 w-px bg-[var(--foreground)]/70" />
        <span className="absolute bottom-0 size-1.5 rounded-full bg-[var(--foreground)]" />
      </span>
    );
  }
  if (kind === "tick") {
    return (
      <span className="size-2 rounded-full bg-[var(--foreground)]/60 ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="relative h-3 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset">
      <span className="absolute inset-y-0 left-0 w-[45%] rounded-full bg-[var(--foreground)]/45" />
    </span>
  );
}

export function LiquidImageLerp() {
  return (
    <ScrollScene label="The loop" note="rAF lerp 0.12 · no re-renders">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[440px] flex-col items-center gap-9 ${reduced ? "lil-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="flex w-full flex-col gap-6">
            <div className="relative mx-auto h-10 w-[280px]">
              <div className="absolute inset-y-3 inset-x-0 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <div
                className="lil-fill absolute inset-y-3 left-0 w-full rounded-full bg-[var(--foreground)]/45"
                style={{ maxWidth: 280 } as CSSProperties}
              />
              <div
                className="lil-target absolute top-1/2 -mt-3 flex flex-col items-center"
                style={{ left: 0 }}
              >
                <span className="h-6 w-px bg-[var(--foreground)]/70" />
                <span className="mt-1 size-1.5 rounded-full bg-[var(--foreground)]" />
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <span className="lil-dot size-2 rounded-full bg-[var(--foreground)]/60" />
              <span className="font-mono text-[11px] text-fd-muted-foreground">
                requestAnimationFrame(tick)
              </span>
            </div>
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            {'el.setAttribute("scale", next.toFixed(2))'}
          </p>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <LegendSwatch kind={item.kind} />
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
