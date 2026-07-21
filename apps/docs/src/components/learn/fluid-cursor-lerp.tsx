"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * One rAF loop lerps three signals toward the pointer: dot (0.25), trail
 * (0.12), and hover scale (0.15). Real component keeps
 * `translate(-50%, -50%)` in the transform so both circles stay centered on
 * their points — keyframes must too, or the larger trail drifts off.
 */
const CSS = `
@keyframes fcl-dot {
  0%   { transform: translate(-50%, -50%) translate(0, 0); }
  100% { transform: translate(-50%, -50%) translate(140px, -36px); }
}
@keyframes fcl-trail {
  0%   { transform: translate(-50%, -50%) translate(0, 0); }
  100% { transform: translate(-50%, -50%) translate(108px, -28px); }
}
.fcl-dot {
  animation: fcl-dot 1.6s cubic-bezier(0.22, 1, 0.36, 1) infinite alternate;
}
.fcl-trail {
  animation: fcl-trail 1.6s cubic-bezier(0.22, 1, 0.36, 1) 80ms infinite alternate;
}
.fcl-static .fcl-dot {
  animation: none;
  transform: translate(-50%, -50%) translate(70px, -18px);
}
.fcl-static .fcl-trail {
  animation: none;
  transform: translate(-50%, -50%) translate(54px, -14px);
}
`;

const LEGEND = [
  {
    name: "Dot lerp 0.25",
    desc: "x += (tx − x) × 0.25 each frame",
    swatch: "bg-[var(--foreground)]",
  },
  {
    name: "Trail lerp 0.12",
    desc: "sx += (tx − sx) × 0.12 — soft lag",
    swatch: "bg-[var(--foreground)]/25",
  },
  {
    name: "Hover lerp 0.15",
    desc: "scale(1 + hover × 1.6) on interactive",
    swatch: "bg-[var(--muted)]",
  },
] as const;

export function FluidCursorLerp() {
  return (
    <ScrollScene label="The motion" note="three lerps · one rAF">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[420px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`relative h-[160px] w-full max-w-[280px] overflow-hidden rounded-xl border border-fd-border bg-[var(--card)] ${reduced ? "fcl-static" : ""}`}
          >
            <div className="absolute left-8 top-[55%] size-0">
              <div className="fcl-trail absolute left-0 top-0 size-[43px] rounded-full bg-[var(--foreground)]/20 blur-md" />
              <div className="fcl-dot absolute left-0 top-0 size-[18px] rounded-full bg-[var(--foreground)]" />
            </div>
            <div
              aria-hidden="true"
              className="absolute right-10 top-8 size-10 rounded-lg border border-fd-border bg-[var(--muted)]"
            />
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            translate3d(…) translate(-50%, -50%) scale(…)
          </p>

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
