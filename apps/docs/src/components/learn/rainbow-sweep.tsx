"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

const RAINBOW_FILL =
  "[background-image:linear-gradient(90deg,var(--rainbow-1),var(--rainbow-5),var(--rainbow-3),var(--rainbow-4),var(--rainbow-2))] [background-size:200%_100%]";

export function RainbowSweep() {
  return (
    <ScrollScene label="Rainbow edge" note="200% gradient, position flow">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className="flex w-full max-w-[320px] flex-col gap-4"
          style={{ "--rainbow-speed": "5s" } as CSSProperties}
        >
          <div
            className={`h-16 w-full rounded-xl ${RAINBOW_FILL} ${
              reduced ? "" : "animate-magic-rainbow"
            } motion-reduce:animate-none`}
          />
          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            background-position slides across a 200%-wide gradient
          </p>
        </div>
      )}
    </ScrollScene>
  );
}
