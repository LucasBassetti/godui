"use client";

import { type CSSProperties, useId } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Same photo stand-in in three stages so the filter chain reads clearly:
 * 1) clean SourceGraphic  2) feTurbulence noise field  3) that photo after
 * feDisplacementMap warps it. Stages share geometry — only the treatment
 * changes.
 */
const CSS = `
@keyframes lia-step {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.lia-step { animation: lia-step 550ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.lia-static .lia-step { animation: none; opacity: 1; transform: none; }
`;

function PhotoBands() {
  return (
    <>
      <rect x="0" y="0" width="80" height="28" fill="var(--muted)" />
      <rect
        x="0"
        y="28"
        width="80"
        height="40"
        fill="var(--foreground)"
        fillOpacity={0.18}
      />
      <rect
        x="0"
        y="68"
        width="80"
        height="28"
        fill="var(--foreground)"
        fillOpacity={0.08}
      />
      <rect
        x="14"
        y="40"
        width="36"
        height="6"
        rx="3"
        fill="var(--foreground)"
        fillOpacity={0.28}
      />
    </>
  );
}

function PhotoStandIn({
  filterId,
  animate,
  reduced,
}: {
  filterId?: string;
  animate?: boolean;
  reduced?: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 80 96"
      className="absolute inset-0 size-full overflow-visible"
    >
      {filterId ? (
        <>
          <defs>
            <filter
              id={filterId}
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.03"
                numOctaves={2}
                seed={2}
                result="noise"
              >
                {animate && !reduced ? (
                  <animate
                    attributeName="baseFrequency"
                    dur="6s"
                    values="0.03;0.05;0.03"
                    repeatCount="indefinite"
                  />
                ) : null}
              </feTurbulence>
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale={reduced ? 12 : 8}
                xChannelSelector="R"
                yChannelSelector="G"
              >
                {animate && !reduced ? (
                  <animate
                    attributeName="scale"
                    dur="2.8s"
                    values="6;16;10;16;6"
                    repeatCount="indefinite"
                  />
                ) : null}
              </feDisplacementMap>
            </filter>
          </defs>
          <g filter={`url(#${filterId})`}>
            <PhotoBands />
          </g>
        </>
      ) : (
        <PhotoBands />
      )}
    </svg>
  );
}

function NoiseField({
  filterId,
  animate,
  reduced,
}: {
  filterId: string;
  animate?: boolean;
  reduced?: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 80 96"
      className="absolute inset-0 size-full"
    >
      <defs>
        <filter id={filterId} x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.08"
            numOctaves={2}
            seed={2}
          >
            {animate && !reduced ? (
              <animate
                attributeName="baseFrequency"
                dur="6s"
                values="0.08;0.12;0.08"
                repeatCount="indefinite"
              />
            ) : null}
          </feTurbulence>
        </filter>
      </defs>
      <rect
        width="80"
        height="96"
        filter={`url(#${filterId})`}
        opacity={0.55}
      />
    </svg>
  );
}

const LEGEND = [
  {
    name: "Source",
    desc: "the img — SourceGraphic into the filter",
  },
  {
    name: "Noise",
    desc: "feTurbulence · baseFrequency drifts so it never freezes",
  },
  {
    name: "Displaced",
    desc: "scale pushes pixels — edges fray into the liquid border",
  },
] as const;

export function LiquidImageAnatomy() {
  const uid = useId().replace(/:/g, "");
  const noiseId = `lia-noise-${uid}`;
  const warpId = `lia-warp-${uid}`;

  return (
    <ScrollScene label="Anatomy" note="same photo · noise · warp">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[440px] flex-col items-center gap-9 ${reduced ? "lia-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="flex w-full items-center justify-center gap-2 sm:gap-3">
            <div
              className="lia-step relative h-28 w-[4.5rem] overflow-hidden rounded-xl border border-fd-border bg-[var(--card)] shadow-sm"
              style={{ "--d": "0ms" } as CSSProperties}
            >
              <PhotoStandIn />
            </div>

            <span
              aria-hidden="true"
              className="lia-step size-1.5 shrink-0 rounded-full bg-[var(--foreground)]/25"
              style={{ "--d": "80ms" } as CSSProperties}
            />

            <div
              className="lia-step relative h-28 w-[4.5rem] overflow-hidden rounded-xl border border-fd-border bg-[var(--card)] shadow-sm"
              style={{ "--d": "120ms" } as CSSProperties}
            >
              <NoiseField filterId={noiseId} animate reduced={reduced} />
            </div>

            <span
              aria-hidden="true"
              className="lia-step size-1.5 shrink-0 rounded-full bg-[var(--foreground)]/25"
              style={{ "--d": "180ms" } as CSSProperties}
            />

            <div
              className="lia-step relative h-28 w-[4.5rem] overflow-visible rounded-xl border border-fd-border bg-[var(--card)] shadow-sm"
              style={{ "--d": "240ms" } as CSSProperties}
            >
              <PhotoStandIn filterId={warpId} animate reduced={reduced} />
            </div>
          </div>

          <p className="max-w-[34ch] text-center text-[13px] text-fd-muted-foreground">
            Watch the third plate: as scale rises, the same bands fray at the
            edge — that&apos;s the liquid border.
          </p>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
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
