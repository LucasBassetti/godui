"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Grayscale depth projection: stars grow / brighten as they approach the
 * vanishing point (small z → large k = focal/z). Uses theme tokens only.
 */
const CSS = `
@keyframes wsa-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.wsa-el { animation: wsa-in 550ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.wsa-static .wsa-el { animation: none; opacity: 1; transform: none; }

@keyframes wsa-fly {
  from { transform: translate(-50%, -50%) scale(0.35); opacity: 0.2; }
  to   { transform: translate(-50%, -50%) scale(1.5); opacity: 1; }
}
.wsa-star { animation: wsa-fly 2.4s linear infinite; }
.wsa-static .wsa-star {
  animation: none;
  transform: translate(-50%, -50%) scale(1);
  opacity: 0.85;
}
`;

const STARS = [
  { x: 28, y: 38, d: 0, size: "size-1" },
  { x: 48, y: 52, d: 0.35, size: "size-1.5" },
  { x: 68, y: 32, d: 0.7, size: "size-1" },
  { x: 38, y: 68, d: 1.05, size: "size-2" },
  { x: 62, y: 58, d: 0.2, size: "size-1.5" },
  { x: 78, y: 48, d: 1.4, size: "size-1" },
] as const;

export function WarpStarfieldAnatomy() {
  return (
    <ScrollScene label="Projection" note="focal / z · recycle at z ≤ 0.02">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-8 ${reduced ? "wsa-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            className="wsa-el relative h-44 w-full overflow-hidden rounded-2xl border border-fd-border bg-[var(--card)]"
            style={{ "--d": "0ms" } as CSSProperties}
          >
            {/* vanishing-point crosshair */}
            <div
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--foreground)]/10"
            />
            <div
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--foreground)]/35"
            />

            {STARS.map((s) => (
              <div
                key={`wsa-${s.x}-${s.y}`}
                className={`wsa-star absolute rounded-full bg-[var(--foreground)] ${s.size}`}
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  animationDelay: `${s.d}s`,
                }}
              />
            ))}
          </div>

          <p className="max-w-[40ch] text-center text-[13px] text-fd-muted-foreground">
            Stars surge out from the center as{" "}
            <span className="font-mono text-[12px]">z</span> shrinks — then
            recycle at the far plane. Count clamps to{" "}
            <span className="font-mono text-[12px]">area / 2200</span>.
          </p>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="size-2 rounded-full bg-[var(--foreground)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Project
              </dt>
              <dd className="font-mono text-[12px] text-fd-muted-foreground">
                k = focal / z
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="size-1.5 rounded-full bg-[var(--foreground)]/35 ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Recycle
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                z ≤ 0.02 → spawn(maxZ)
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="size-3 rounded-full border border-[var(--foreground)]/10 bg-transparent ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Budget
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                max(80, min(count, area/2200))
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
