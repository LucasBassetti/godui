"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

const CSS = `
@keyframes ffa-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.ffa-el { animation: ffa-in 550ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.ffa-static .ffa-el { animation: none; opacity: 1; transform: none; }
@keyframes ffa-flow {
  0% { transform: translate(0, 0); opacity: 0.3; }
  50% { opacity: 1; }
  100% { transform: translate(28px, -18px); opacity: 0.2; }
}
.ffa-p { animation: ffa-flow 2.4s cubic-bezier(0.3,0.7,0.4,1) infinite; }
.ffa-static .ffa-p { animation: none; transform: translate(14px, -9px); opacity: 0.7; }
`;

export function FlowFieldAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="noise → angle → step">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-8 ${reduced ? "ffa-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            className="ffa-el relative h-40 w-full overflow-hidden rounded-2xl border border-fd-border bg-[var(--card)]"
            style={{ "--d": "0ms" } as CSSProperties}
          >
            <svg
              aria-hidden="true"
              className="absolute inset-0 size-full opacity-30"
            >
              <defs>
                <pattern
                  id="ffa-grid"
                  width="24"
                  height="24"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M12 4v16M4 12h16"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-fd-muted-foreground"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#ffa-grid)" />
            </svg>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={`ffa-p-${i}`}
                className="ffa-p absolute h-0.5 w-6 rounded-full bg-[var(--foreground)]/50"
                style={{
                  left: `${18 + i * 14}%`,
                  top: `${55 - i * 6}%`,
                  animationDelay: `${i * 0.18}s`,
                  transform: `rotate(${-25 + i * 8}deg)`,
                }}
              />
            ))}
          </div>
          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="h-0.5 w-8 rounded-full bg-[var(--foreground)]/30 ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Noise
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                valueNoise(x·scale, y·scale+z)
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-0.5 w-8 rotate-[-25deg] rounded-full bg-[var(--foreground)]/50 ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Angle
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                noise × π × 4
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-0.5 w-8 rounded-full bg-[var(--foreground)]/50 ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Step
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                1.6 × speed px / frame
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
