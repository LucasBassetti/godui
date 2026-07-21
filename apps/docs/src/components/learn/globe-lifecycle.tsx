"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Two lifecycle beats from the effect: mount starts `createGlobe` and an
 * `rAF` tick (plus a one-frame `opacity` reveal so the canvas doesn't pop in
 * unpainted), and the cleanup function cancels that frame and calls
 * `globe.destroy()` — the WebGL context is gone, not just hidden.
 */
const CSS = `
@keyframes glf-panel {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: none; }
}
.glf-panel { opacity: 0; animation: glf-panel 460ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }

@keyframes glf-tick {
  to { transform: rotate(360deg); }
}
.glf-tick { animation: glf-tick 2.4s linear infinite; }

@keyframes glf-destroyed {
  0%, 100% { opacity: 0.35; transform: scale(0.92); }
  50%      { opacity: 0.15; transform: scale(0.86); }
}
.glf-ghost { animation: glf-destroyed 2.4s cubic-bezier(0.3,0.7,0.4,1) infinite; }

.glf-static .glf-panel { animation: none; opacity: 1; transform: none; }
.glf-static .glf-tick { animation: none; }
.glf-static .glf-ghost { animation: none; opacity: 0.35; transform: scale(0.92); }
`;

const LEGEND = [
  {
    name: "Mount",
    desc: "createGlobe(canvas, config) + rAF loop starts",
    swatch: "bg-[var(--foreground)]/60",
  },
  {
    name: "Idle spin",
    desc: "tick → phi += 0.005 → globe.update(), forever",
    swatch: "bg-[var(--foreground)]/30",
  },
  {
    name: "Destroy",
    desc: "cleanup: cancelAnimationFrame + globe.destroy()",
    swatch: "border border-dashed border-[var(--foreground)]/40 bg-transparent",
  },
] as const;

export function GlobeLifecycle() {
  return (
    <ScrollScene label="Lifecycle" note="rAF tick, then a real teardown">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[440px] flex-col items-center gap-9 ${reduced ? "glf-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="flex items-center gap-10">
            <div
              className="glf-panel flex flex-col items-center gap-3"
              style={{ "--d": "0ms" } as CSSProperties}
            >
              <div className="relative flex size-24 items-center justify-center rounded-full border border-fd-border bg-[var(--card)] shadow-md">
                <span className="glf-tick absolute inset-0 rounded-full [background:conic-gradient(from_0deg,var(--foreground)_0deg,transparent_60deg,transparent_360deg)] opacity-30" />
                <span className="relative size-10 rounded-full bg-[var(--muted)]" />
              </div>
              <p className="font-mono text-[11px] text-fd-muted-foreground">
                mounted — rAF running
              </p>
            </div>

            <svg
              aria-hidden="true"
              width="28"
              height="16"
              viewBox="0 0 28 16"
              fill="none"
              stroke="var(--foreground)"
              strokeOpacity={0.4}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
            >
              <path d="M2 8h22M18 2l6 6-6 6" />
            </svg>

            <div
              className="glf-panel flex flex-col items-center gap-3"
              style={{ "--d": "140ms" } as CSSProperties}
            >
              <div className="relative flex size-24 items-center justify-center rounded-full border border-dashed border-[var(--foreground)]/30 bg-transparent">
                <span className="glf-ghost size-10 rounded-full bg-[var(--muted)]" />
              </div>
              <p className="font-mono text-[11px] text-fd-muted-foreground">
                unmounted — context freed
              </p>
            </div>
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
