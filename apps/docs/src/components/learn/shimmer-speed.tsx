"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * The spark's Web Animations timeline doesn't restart on hover — it keeps
 * running and `getAnimations().playbackRate` jumps from 1 to 3. Same sweep,
 * three times faster. Two tracks, same distance, different durations stand
 * in for the rate change (CSS can't set playbackRate directly).
 */

const CSS = `
@keyframes ss-sweep {
  from { transform: translateX(-100%); }
  to   { transform: translateX(320%); }
}
.ss-track-1 .ss-dot { animation: ss-sweep 3.6s linear infinite; }
.ss-track-3 .ss-dot { animation: ss-sweep 1.2s linear infinite; }
.ss-static .ss-dot { animation: none; transform: translateX(60%); }
`;

const ROWS: { key: string; caption: string; trackCls: string }[] = [
  { key: "rate1", caption: "leave / blur — rate 1×", trackCls: "ss-track-1" },
  {
    key: "rate3",
    caption: "hover / focus-visible — rate 3×",
    trackCls: "ss-track-3",
  },
];

export function ShimmerSpeed() {
  return (
    <ScrollScene label="Playback rate" note="same animation, 3× faster">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[420px] flex-col gap-8 ${reduced ? "ss-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          {ROWS.map((row) => (
            <div key={row.key} className="flex flex-col gap-2.5">
              <div
                className={`relative h-2 w-full overflow-hidden rounded-full bg-[var(--muted)] ${row.trackCls}`}
              >
                <span className="ss-dot absolute inset-y-0 left-0 w-10 rounded-full bg-[var(--foreground)]/70" />
              </div>
              <p className="font-mono text-[11px] text-fd-muted-foreground">
                {row.caption}
              </p>
            </div>
          ))}

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <dt className="font-medium text-[13px] text-fd-foreground">
                Rate 1×
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                resting state, ambient shimmer
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <dt className="font-medium text-[13px] text-fd-foreground">
                Rate 3×
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                hover / keyboard focus, same timeline
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
