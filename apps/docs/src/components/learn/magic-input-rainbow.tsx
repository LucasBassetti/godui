"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * The one colored scene. While focused with `rainbow`, the edge + shadow fills
 * swap to a 200%-wide linear-gradient and `animate-magic-rainbow` slides
 * `background-position` across it — the same utility the live component uses.
 * The front stays neutral so the color reads as a glowing edge, not a fill.
 */
const RAINBOW_FILL =
  "[background-image:linear-gradient(90deg,var(--rainbow-1),var(--rainbow-5),var(--rainbow-3),var(--rainbow-4),var(--rainbow-2))] [background-size:200%_100%]";

export function MagicInputRainbow() {
  return (
    <ScrollScene label="Rainbow edge" note="200% gradient, position slides">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className="flex w-full max-w-[360px] flex-col items-center gap-6"
          style={{ "--rainbow-speed": "5s" } as CSSProperties}
        >
          <div className="relative h-[60px] w-[260px]">
            {/* Shadow — the rainbow glow, dropped + blurred behind the field. */}
            <span
              className={`absolute inset-0 translate-y-[6px] rounded-xl opacity-70 blur-[12px] ${RAINBOW_FILL} ${reduced ? "" : "animate-magic-rainbow"} motion-reduce:animate-none`}
            />
            {/* Edge — the crisp rainbow border directly under the front. */}
            <span
              className={`absolute inset-0 rounded-xl ${RAINBOW_FILL} ${reduced ? "" : "animate-magic-rainbow"} motion-reduce:animate-none`}
            />
            {/* Front — neutral field, lifted so the edge peeks below. */}
            <span className="absolute inset-0 flex -translate-y-[4px] items-center rounded-xl border border-transparent bg-[var(--card)] px-4">
              <span className="h-2 w-24 rounded-full bg-[var(--foreground)]/25" />
            </span>
          </div>
          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            edge + shadow share one gradient; only the position animates
          </p>
        </div>
      )}
    </ScrollScene>
  );
}
