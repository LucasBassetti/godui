"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Cruise (points) vs warp (streaks). Grayscale tokens only — no forced night
 * sky. Streaks grow from the vanishing point the way prev→curr projection does.
 */
const CSS = `
@keyframes wsw-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.wsw-el { animation: wsw-in 550ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.wsw-static .wsw-el { animation: none; opacity: 1; transform: none; }

@keyframes wsw-streak {
  0%   { transform: scaleX(0.25); opacity: 0.25; }
  100% { transform: scaleX(1.5); opacity: 1; }
}
.wsw-s {
  animation: wsw-streak 1.2s ease-out infinite;
  transform-origin: left center;
}
.wsw-static .wsw-s { animation: none; transform: scaleX(1); opacity: 0.85; }

@keyframes wsw-dot {
  0%, 100% { opacity: 0.35; transform: scale(0.7); }
  50% { opacity: 1; transform: scale(1.15); }
}
.wsw-d { animation: wsw-dot 1.6s ease-in-out infinite; }
.wsw-static .wsw-d { animation: none; opacity: 0.8; transform: none; }
`;

export function WarpStarfieldWarp() {
  return (
    <ScrollScene label="Warp" note="points · or prev→curr strokes">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-8 ${reduced ? "wsw-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="grid w-full grid-cols-2 gap-3">
            <div
              className="wsw-el flex flex-col items-center gap-2"
              style={{ "--d": "0ms" } as CSSProperties}
            >
              <div className="relative h-36 w-full overflow-hidden rounded-xl border border-fd-border bg-[var(--card)]">
                <div className="absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--foreground)]/30" />
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={`wsw-d-${i}`}
                    className="wsw-d absolute size-1.5 rounded-full bg-[var(--foreground)]"
                    style={{
                      left: `${42 + i * 8}%`,
                      top: `${30 + ((i * 17) % 40)}%`,
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                ))}
              </div>
              <span className="font-mono text-[11px] text-fd-muted-foreground">
                cruise · fill
              </span>
            </div>

            <div
              className="wsw-el flex flex-col items-center gap-2"
              style={{ "--d": "100ms" } as CSSProperties}
            >
              <div className="relative h-36 w-full overflow-hidden rounded-xl border border-fd-border bg-[var(--card)]">
                <div className="absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--foreground)]/30" />
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={`wsw-s-${i}`}
                    className="wsw-s absolute h-px bg-[var(--foreground)]/70"
                    style={{
                      left: "48%",
                      top: `${22 + i * 11}%`,
                      width: `${18 + i * 7}%`,
                      transform: `rotate(${-38 + i * 13}deg)`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
              <span className="font-mono text-[11px] text-fd-muted-foreground">
                warp · stroke
              </span>
            </div>
          </div>

          <p className="max-w-[40ch] text-center font-mono text-[12px] text-fd-muted-foreground">
            dz = 0.004 × speed × (warp ? 2 : 1)
          </p>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Cruise
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                arc + fill · warp=false
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Hyperspace
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                stroke previous → current projection
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
