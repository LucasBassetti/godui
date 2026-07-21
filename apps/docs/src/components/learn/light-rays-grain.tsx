"use client";

import { type CSSProperties, useId } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Before / noise / after — grain alone is illegible without the fan underneath.
 * Same soft-fan base; middle plate is feTurbulence; right plate blends both.
 */
const CSS = `
@keyframes lrg-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.lrg-el { animation: lrg-in 550ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.lrg-static .lrg-el { animation: none; opacity: 1; transform: none; }
`;

const FAN =
  "repeating-conic-gradient(from 0deg at 50% 0%, transparent 0deg, rgba(0,0,0,0.3) 4deg, transparent 26deg)";

export function LightRaysGrain() {
  const uid = useId().replace(/:/g, "");
  const noiseId = `lrg-noise-${uid}`;
  const grainId = `lrg-grain-${uid}`;

  return (
    <ScrollScene label="Grain" note="clean · noise · overlay">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[520px] flex-col items-center gap-8 ${reduced ? "lrg-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <svg
            aria-hidden="true"
            className="pointer-events-none absolute size-0"
          >
            <defs>
              <filter id={noiseId} x="0" y="0" width="100%" height="100%">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.9"
                  numOctaves={2}
                  stitchTiles="stitch"
                />
              </filter>
              <filter id={grainId} x="0" y="0" width="100%" height="100%">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.9"
                  numOctaves={2}
                  stitchTiles="stitch"
                />
              </filter>
            </defs>
          </svg>

          <div className="flex w-full gap-2 sm:gap-3">
            {/* Clean fan */}
            <div
              className="lrg-el flex flex-1 flex-col items-center gap-2"
              style={{ "--d": "0ms" } as CSSProperties}
            >
              <div className="relative h-32 w-full overflow-hidden rounded-xl border border-fd-border bg-[var(--card)]">
                <FanBase />
              </div>
              <span className="font-mono text-[11px] text-fd-muted-foreground">
                clean
              </span>
            </div>

            {/* Noise field alone */}
            <div
              className="lrg-el flex flex-1 flex-col items-center gap-2"
              style={{ "--d": "100ms" } as CSSProperties}
            >
              <div className="relative h-32 w-full overflow-hidden rounded-xl border border-fd-border bg-[var(--muted)]">
                <svg
                  aria-hidden="true"
                  className="absolute inset-0 size-full opacity-55"
                >
                  <rect
                    width="100%"
                    height="100%"
                    filter={`url(#${noiseId})`}
                  />
                </svg>
              </div>
              <span className="font-mono text-[11px] text-fd-muted-foreground">
                feTurbulence
              </span>
            </div>

            {/* Combined */}
            <div
              className="lrg-el flex flex-1 flex-col items-center gap-2"
              style={{ "--d": "200ms" } as CSSProperties}
            >
              <div className="relative h-32 w-full overflow-hidden rounded-xl border border-fd-border bg-[var(--card)]">
                <FanBase />
                <svg
                  aria-hidden="true"
                  className="absolute inset-0 size-full mix-blend-overlay opacity-[0.35]"
                >
                  <rect
                    width="100%"
                    height="100%"
                    filter={`url(#${grainId})`}
                  />
                </svg>
              </div>
              <span className="font-mono text-[11px] text-fd-muted-foreground">
                overlay
              </span>
            </div>
          </div>

          <p className="max-w-[38ch] text-center text-[13px] text-fd-muted-foreground">
            Default{" "}
            <span className="font-mono text-[12px]">grain={"{0.05}"}</span> is
            subtle on purpose — bump it in the Result to feel the film grit. Set{" "}
            <span className="font-mono text-[12px]">0</span> to drop the SVG
            layer entirely.
          </p>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Noise
              </dt>
              <dd className="font-mono text-[12px] text-fd-muted-foreground">
                fractalNoise · baseFrequency 0.9
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Blend
              </dt>
              <dd className="font-mono text-[12px] text-fd-muted-foreground">
                mix-blend-overlay · opacity = grain
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}

function FanBase() {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 40% at 50% -5%, rgba(0,0,0,0.14), transparent 70%)",
        }}
      />
      <div
        className="absolute inset-[-40%] origin-top"
        style={{
          backgroundImage: FAN,
          filter: "blur(4px)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 8%, transparent 78%)",
          maskImage: "linear-gradient(to bottom, black 8%, transparent 78%)",
        }}
      />
    </>
  );
}
