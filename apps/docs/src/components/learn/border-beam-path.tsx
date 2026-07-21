"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * The motion: infinite linear `offsetDistance` along the rect offset-path.
 * `reverse` doesn't flip an animation direction flag — it swaps the tween
 * ranges ([initial, 100+initial] vs [100−initial, −initial]).
 */
const CSS = `
@keyframes bbp-cw {
  from { offset-distance: 0%; }
  to   { offset-distance: 100%; }
}
.bbp-cw { animation: bbp-cw 4s linear infinite; offset-path: rect(0 auto auto 0 round 48px); }

@keyframes bbp-ccw {
  from { offset-distance: 100%; }
  to   { offset-distance: 0%; }
}
.bbp-ccw { animation: bbp-ccw 4s linear infinite; offset-path: rect(0 auto auto 0 round 48px); }

@keyframes bbp-in {
  from { opacity: 0; transform: scale(0.94); }
  to   { opacity: 1; transform: scale(1); }
}
.bbp-card { animation: bbp-in 480ms cubic-bezier(0.3,0.7,0.4,1.2) both; }

.bbp-static .bbp-cw { animation: none; offset-distance: 25%; }
.bbp-static .bbp-ccw { animation: none; offset-distance: 75%; }
.bbp-static .bbp-card { animation: none; opacity: 1; transform: none; }
`;

const LEGEND = [
  {
    name: "Clockwise",
    desc: "offsetDistance [initialOffset%, 100 + initialOffset%]",
    swatch: "bg-[var(--foreground)]/50",
  },
  {
    name: "Reverse",
    desc: "swaps to [100 − initial%, −initial%] — still linear forward",
    swatch: "bg-[var(--muted)] ring-1 ring-[var(--foreground)]/30 ring-inset",
  },
  {
    name: "Loop",
    desc: "repeat: Infinity, ease: linear, duration (default 6s)",
    swatch: "bg-transparent ring-1 ring-fd-border ring-inset",
  },
] as const;

function Track({ beamClass }: { beamClass: string }) {
  return (
    <div className="bbp-card relative aspect-square w-[140px] overflow-hidden rounded-2xl border border-fd-border bg-[var(--muted)]/30">
      <div className="pointer-events-none absolute inset-0 rounded-[inherit]">
        <div
          className={`absolute aspect-square size-8 rounded-sm bg-[var(--foreground)]/55 ${beamClass}`}
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="h-2 w-10 rounded-full bg-[var(--foreground)]/20" />
      </div>
    </div>
  );
}

export function BorderBeamPath() {
  return (
    <ScrollScene
      label="Offset path"
      note="linear · infinite · reverse swaps ranges"
    >
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[360px] flex-col items-center gap-9 ${reduced ? "bbp-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="flex items-center justify-center gap-6">
            <Track beamClass="bbp-cw" />
            <Track beamClass="bbp-ccw" />
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
