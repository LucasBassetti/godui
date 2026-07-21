"use client";

import { useId } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Showpiece: the living edge from the real filter. SMIL drifts
 * `baseFrequency` (noise never freezes); displacement `scale` eases up so
 * the silhouette boils — same mechanism as LiquidImage, without pointer.
 * Dark stage + padded filter region so the irregular border can read.
 */
const CSS = `
@keyframes lie-in {
  from { opacity: 0; transform: scale(0.94); }
  to   { opacity: 1; transform: scale(1); }
}
.lie-stage { animation: lie-in 520ms cubic-bezier(0.3,0.7,0.4,1.2) both; }
.lie-static .lie-stage { animation: none; opacity: 1; transform: none; }
`;

const LEGEND = [
  {
    name: "Noise drift",
    desc: "SMIL animates baseFrequency over ~16s — field never freezes",
    swatch: "bg-[var(--muted)]",
  },
  {
    name: "Scale",
    desc: "feDisplacementMap scale — how hard pixels are pushed",
    swatch: "bg-[var(--foreground)]/40",
  },
  {
    name: "Padded filter",
    desc: "x/y −20%, 140% size — edge pixels can spill past the rect",
    swatch: "bg-transparent ring-1 ring-[var(--foreground)]/40 ring-inset",
  },
] as const;

export function LiquidImageEdge() {
  const uid = useId().replace(/:/g, "");
  const filterId = `lie-edge-${uid}`;

  return (
    <ScrollScene label="The edge" note="drifting noise · rising scale">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[420px] flex-col items-center gap-9 ${reduced ? "lie-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="lie-stage relative flex h-[220px] w-full max-w-[280px] items-center justify-center overflow-hidden rounded-xl bg-[var(--foreground)]/[0.04] ring-1 ring-fd-border ring-inset">
            <svg
              aria-hidden="true"
              viewBox="0 0 200 200"
              className="size-[168px] overflow-visible"
            >
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
                    baseFrequency={reduced ? 0.018 : 0.014}
                    numOctaves={2}
                    seed={2}
                    result="noise"
                  >
                    {reduced ? null : (
                      <animate
                        attributeName="baseFrequency"
                        dur="8s"
                        values="0.014;0.024;0.014"
                        repeatCount="indefinite"
                      />
                    )}
                  </feTurbulence>
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="noise"
                    scale={reduced ? 18 : 4}
                    xChannelSelector="R"
                    yChannelSelector="G"
                  >
                    {reduced ? null : (
                      <animate
                        attributeName="scale"
                        dur="3.2s"
                        values="4;22;14;22;4"
                        keyTimes="0;0.35;0.55;0.75;1"
                        calcMode="spline"
                        keySplines="0.4 0 0.2 1;0.4 0 0.2 1;0.4 0 0.2 1;0.4 0 0.2 1"
                        repeatCount="indefinite"
                      />
                    )}
                  </feDisplacementMap>
                </filter>
              </defs>

              {/* Soft plate — displacement frays this into the boiling border */}
              <g filter={`url(#${filterId})`}>
                <rect
                  x="28"
                  y="28"
                  width="144"
                  height="144"
                  rx="20"
                  fill="var(--card)"
                />
                <rect
                  x="28"
                  y="28"
                  width="144"
                  height="52"
                  fill="var(--muted)"
                />
                <rect
                  x="28"
                  y="80"
                  width="144"
                  height="60"
                  fill="var(--foreground)"
                  fillOpacity={0.14}
                />
                <rect
                  x="48"
                  y="100"
                  width="64"
                  height="8"
                  rx="4"
                  fill="var(--foreground)"
                  fillOpacity={0.28}
                />
                <rect
                  x="28"
                  y="140"
                  width="144"
                  height="32"
                  fill="var(--foreground)"
                  fillOpacity={0.08}
                />
              </g>
            </svg>
          </div>

          <p className="max-w-[36ch] text-center text-[13px] text-fd-muted-foreground">
            That irregular silhouette isn&apos;t a clip-path — it&apos;s the
            photo&apos;s own pixels pushed past the rect by the noise field.
            Higher scale → wilder border.
          </p>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <span
                  className={`h-1.5 w-8 rounded-full ${item.swatch} ring-1 ring-fd-border ring-inset`}
                />
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
