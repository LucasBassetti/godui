"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Idle pause: an IntersectionObserver with `rootMargin: "128px"` toggles
 * `animationPlayState` on the gradient span. In view → running; past the
 * margin → paused. Two frozen frames stand in for those states.
 */

const STOPS = [
  "#ff2d55",
  "#ff9500",
  "#ffd60a",
  "#34c759",
  "#00c7be",
  "#0a84ff",
  "#5e5ce6",
  "#bf5af2",
  "#ff2d55",
].join(", ");

const FILL = {
  backgroundImage: `linear-gradient(135deg, ${STOPS})`,
  backgroundSize: "200% auto",
} as CSSProperties;

const CSS = `
@keyframes atl-sweep {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes atl-in {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: none; }
}
.atl-panel {
  opacity: 0;
  animation: atl-in 460ms cubic-bezier(0.3, 0.7, 0.4, 1.2) var(--d) both;
}
.atl-play { animation: atl-sweep 3.2s linear infinite; }
.atl-static .atl-panel { opacity: 1; animation: none; transform: none; }
.atl-static .atl-play { animation: none; background-position: 40% 50%; }
`;

export function AuroraTextLifecycle() {
  return (
    <ScrollScene label="Cheap when idle" note="IntersectionObserver pause">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[420px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`flex items-center gap-8 ${reduced ? "atl-static" : ""}`}
          >
            <div
              className="atl-panel flex flex-col items-center gap-3"
              style={{ "--d": "0ms" } as CSSProperties}
            >
              <span className="font-mono text-[11px] text-fd-muted-foreground">
                in view
              </span>
              <div
                className="atl-play h-11 w-28 rounded-xl"
                style={FILL}
                aria-hidden="true"
              />
            </div>
            <div
              className="atl-panel flex flex-col items-center gap-3"
              style={{ "--d": "120ms" } as CSSProperties}
            >
              <span className="font-mono text-[11px] text-fd-muted-foreground">
                128px past edge
              </span>
              <div
                className="h-11 w-28 rounded-xl opacity-35"
                style={{ ...FILL, backgroundPosition: "35% 50%" }}
                aria-hidden="true"
              />
            </div>
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            animationPlayState flips to “paused” outside rootMargin 128px —
            resumes seamlessly on scroll-in
          </p>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="h-3 w-7 rounded-xl bg-[linear-gradient(135deg,#ff2d55,#ffd60a,#0a84ff)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Playing
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                intersecting — animationPlayState empty
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-3 w-7 rounded-xl bg-[linear-gradient(135deg,#ff2d55,#ffd60a,#0a84ff)] opacity-35 ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Paused
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                off-screen — animationPlayState paused
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
