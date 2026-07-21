"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * `scrollYProgress` from `useScroll` jumps around with every scroll event —
 * fine for math, jittery to look at. `useSpring(progress, { stiffness: 320,
 * damping: 32, mass: 0.9 })` re-emits it as a smoothed value the rail
 * actually renders. Raw tracks the driver exactly; the spring lags slightly
 * and settles instead of snapping.
 */
const CSS = `
@keyframes stlsp-raw {
  0%, 6%   { transform: scaleY(0); }
  50%      { transform: scaleY(1); }
  94%,100% { transform: scaleY(0); }
}
@keyframes stlsp-spring {
  0%, 6%   { transform: scaleY(0); }
  42%      { transform: scaleY(0.78); }
  58%      { transform: scaleY(1.05); }
  68%      { transform: scaleY(0.97); }
  78%,94%  { transform: scaleY(1); }
  100%     { transform: scaleY(0); }
}
.stlsp-raw { animation: stlsp-raw 3.8s cubic-bezier(0.3,0.7,0.4,1) infinite; }
.stlsp-spring { animation: stlsp-spring 3.8s cubic-bezier(0.3,0.7,0.4,1) infinite; }
.stlsp-static .stlsp-raw,
.stlsp-static .stlsp-spring { animation: none; transform: scaleY(1); }
`;

export function ScrollTimelineSpring() {
  return (
    <ScrollScene label="Why a spring" note="raw scroll vs. smoothed">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[380px] flex-col items-center gap-9">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className={`flex items-end gap-10 ${reduced ? "stlsp-static" : ""}`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="relative h-40 w-1.5 overflow-hidden rounded-full bg-[var(--muted)]">
                <div className="stlsp-raw absolute inset-0 origin-bottom rounded-full bg-[var(--foreground)]/45" />
              </div>
              <span className="font-mono text-[11px] text-fd-muted-foreground">
                raw
              </span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="relative h-40 w-1.5 overflow-hidden rounded-full bg-[var(--muted)]">
                <div className="stlsp-spring absolute inset-0 origin-bottom rounded-full bg-[var(--foreground)]/70" />
              </div>
              <span className="font-mono text-[11px] text-fd-muted-foreground">
                spring
              </span>
            </div>
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            {"useSpring(progress, { stiffness: 320, damping: 32, mass: 0.9 })"}
          </p>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--foreground)]/45 ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                scrollYProgress
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                matches the scroll position exactly, every event
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--foreground)]/70 ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Spring-smoothed
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                lags slightly, settles instead of snapping
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
