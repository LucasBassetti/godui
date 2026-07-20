"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

const RAINBOW_FILL =
  "[background-image:linear-gradient(90deg,var(--rainbow-1),var(--rainbow-5),var(--rainbow-3),var(--rainbow-4),var(--rainbow-2))] [background-size:200%_100%]";

const CSS = `
@keyframes mtr-in {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: none; }
}
.mtr-panel { opacity: 0; animation: mtr-in 460ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.mtr-static .mtr-panel { opacity: 1; animation: none; transform: none; }
`;

/**
 * The rainbow edge/shadow are an infinite `background-position` keyframe —
 * main-thread paint work that costs nothing while the tablist is off screen.
 * A `rootMargin: "128px"` IntersectionObserver toggles `animationPlayState`
 * on every `.animate-magic-rainbow` layer: paused outside the margin, running
 * the instant it's within 128px of the viewport. Two frozen frames, side by
 * side, stand in for those two states.
 */
export function MagicTabRainbow() {
  return (
    <ScrollScene label="Cheap when idle" note="IntersectionObserver pause">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[420px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`flex items-center gap-8 ${reduced ? "mtr-static" : ""}`}
          >
            <div
              className="mtr-panel flex flex-col items-center gap-3"
              style={{ "--d": "0ms" } as CSSProperties}
            >
              <span className="font-mono text-[11px] text-fd-muted-foreground">
                in view
              </span>
              <div
                className={`h-11 w-28 rounded-xl ${RAINBOW_FILL} ${
                  reduced ? "" : "animate-magic-rainbow"
                } motion-reduce:animate-none`}
              />
            </div>
            <div
              className="mtr-panel flex flex-col items-center gap-3"
              style={{ "--d": "120ms" } as CSSProperties}
            >
              <span className="font-mono text-[11px] text-fd-muted-foreground">
                128px past edge
              </span>
              <div
                className={`h-11 w-28 rounded-xl opacity-35 ${RAINBOW_FILL}`}
                style={{ backgroundPosition: "35% 0" }}
              />
            </div>
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            animationPlayState flips to “paused” once the tablist clears the
            128px margin — resumes seamlessly on the way back in
          </p>
        </div>
      )}
    </ScrollScene>
  );
}
