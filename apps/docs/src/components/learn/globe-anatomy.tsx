"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * `Globe` is one `<canvas>` cobe paints into, plus whatever `markers` you
 * hand it — nothing else in the DOM. The circle stands in for the WebGL
 * surface; the dots are `DEFAULT_CONFIG.markers`' relative screen positions
 * on the visible hemisphere, not a literal lat/long projection.
 */
const MARKERS = [
  { left: "34%", top: "30%", size: 7 }, // SF
  { left: "58%", top: "26%", size: 9 }, // NYC
  { left: "50%", top: "18%", size: 7 }, // London
  { left: "72%", top: "34%", size: 8 }, // Tokyo
  { left: "44%", top: "58%", size: 7 }, // São Paulo
  { left: "68%", top: "52%", size: 6 }, // Singapore
];

const CSS = `
@keyframes gla-in {
  from { opacity: 0; transform: scale(0.88); }
  to   { opacity: 1; transform: scale(1); }
}
.gla-canvas { animation: gla-in 700ms cubic-bezier(0.3,0.7,0.4,1.2) both; }

@keyframes gla-marker {
  from { opacity: 0; transform: scale(0.4); }
  to   { opacity: 1; transform: scale(1); }
}
.gla-marker { opacity: 0; animation: gla-marker 380ms cubic-bezier(0.3,0.7,0.4,1.4) var(--d) both; }

@keyframes gla-drag {
  0%, 100% { opacity: 0.5; transform: translateX(0); }
  50%      { opacity: 1; transform: translateX(6px); }
}
.gla-drag { animation: gla-drag 1.8s cubic-bezier(0.3,0.7,0.4,1) infinite; }

.gla-static .gla-canvas,
.gla-static .gla-marker { animation: none; opacity: 1; transform: none; }
.gla-static .gla-drag { animation: none; opacity: 0.6; transform: none; }
`;

const LEGEND = [
  {
    name: "Canvas",
    desc: "cobe WebGL surface — createGlobe(canvas, config)",
    swatch: "bg-[var(--muted)]",
  },
  {
    name: "Markers",
    desc: "config.markers — location + size, glowColor tint",
    swatch: "bg-[var(--foreground)]/50",
  },
  {
    name: "Drag",
    desc: "pointerMovement offsets phi while held",
    swatch: "bg-transparent ring-1 ring-[var(--foreground)]/40 ring-inset",
  },
] as const;

export function GlobeAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="one canvas · markers · pointer drag">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[380px] flex-col items-center gap-9 ${reduced ? "gla-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="relative size-44">
            <div className="gla-canvas absolute inset-0 rounded-full shadow-inner [background:radial-gradient(circle_at_35%_30%,var(--card),var(--muted)_65%)]" />
            {MARKERS.map((m, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed marker set
                key={i}
                className="gla-marker absolute rounded-full bg-[var(--foreground)]/60 shadow-[0_0_6px_var(--foreground)]"
                style={
                  {
                    left: m.left,
                    top: m.top,
                    width: m.size,
                    height: m.size,
                    "--d": `${180 + i * 70}ms`,
                  } as CSSProperties
                }
              />
            ))}
            <span
              aria-hidden="true"
              className="gla-drag absolute -right-9 top-1/2 flex -translate-y-1/2 items-center gap-1 text-[var(--foreground)]/70"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 8L22 12L18 16" />
                <path d="M6 8L2 12L6 16" />
                <path d="M2 12H22" />
              </svg>
            </span>
          </div>

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
