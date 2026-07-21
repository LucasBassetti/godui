"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * The aurora itself: a 200%-wide 135° rainbow whose `background-position`
 * drifts 0% → 100% → 0%. Same keyframe shape as `aurora-text` in styles.css.
 * Color is the subject. Keyed remount via `cycle` restarts the loop on replay.
 */

const FILL = {
  backgroundImage:
    "linear-gradient(135deg, #ff2d55, #ff9500, #ffd60a, #34c759, #00c7be, #0a84ff, #5e5ce6, #bf5af2, #ff2d55)",
  backgroundSize: "200% auto",
} as CSSProperties;

const CSS = `
@keyframes ats-sweep {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.ats-bar { animation: ats-sweep 4s linear infinite; }
.ats-static .ats-bar { animation: none; background-position: 35% 50%; }
@keyframes ats-in {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: none; }
}
.ats-stage {
  opacity: 0;
  animation: ats-in 500ms cubic-bezier(0.3, 0.7, 0.4, 1.2) both;
}
.ats-static .ats-stage { opacity: 1; animation: none; transform: none; }
`;

export function AuroraTextSweep() {
  return (
    <ScrollScene label="The sweep" note="background-position 0% → 100% → 0%">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[420px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`ats-stage flex w-full flex-col items-center gap-5 ${reduced ? "ats-static" : ""}`}
          >
            <div
              className="ats-bar h-16 w-full rounded-xl"
              style={FILL}
              aria-hidden="true"
            />
            <div className="flex w-full items-center gap-2" aria-hidden="true">
              <span className="ats-bar h-3 flex-1 rounded-full" style={FILL} />
              <span className="ats-bar h-3 w-16 rounded-full" style={FILL} />
              <span
                className="ats-bar h-3 flex-[0.7] rounded-full"
                style={FILL}
              />
            </div>
            <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
              bg-[length:200%_auto] · animate-aurora-text
            </p>
          </div>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="h-3 w-8 rounded-xl bg-[linear-gradient(135deg,#ff2d55,#ffd60a,#0a84ff,#bf5af2)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Gradient
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                200% wide, stops looped to first
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-3 w-8 rounded-xl border-2 border-[var(--foreground)]/40 bg-transparent ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Position
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                only property that moves
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
