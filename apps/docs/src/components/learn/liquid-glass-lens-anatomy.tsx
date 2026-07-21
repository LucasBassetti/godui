"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Frost / fixed glint / full-ramp map — grayscale tokens. Map plate uses a
 * foreground ramp, not the real red-channel SVG colors.
 */
const CSS = `
@keyframes lgla-in {
  from { opacity: 0; transform: translateY(8px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
.lgla-el { animation: lgla-in 600ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.lgla-static .lgla-el { animation: none; opacity: 1; transform: none; }
`;

export function LiquidGlassLensAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="frost · fixed glint · band=0 map">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-8 ${reduced ? "lgla-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="flex w-full items-end justify-center gap-3 sm:gap-4">
            <div
              className="lgla-el flex flex-col items-center gap-2"
              style={{ "--d": "0ms" } as CSSProperties}
            >
              <div className="relative size-24 overflow-hidden rounded-full border border-fd-border bg-[var(--card)] shadow-sm">
                <div className="absolute inset-0 bg-[var(--muted)]/60 backdrop-blur-[2px]" />
              </div>
              <span className="font-mono text-[11px] text-fd-muted-foreground">
                frost
              </span>
            </div>

            <div
              className="lgla-el flex flex-col items-center gap-2"
              style={{ "--d": "100ms" } as CSSProperties}
            >
              <div className="relative size-24 overflow-hidden rounded-full border border-fd-border bg-[var(--card)] shadow-sm">
                <div className="absolute inset-0 bg-[var(--muted)]/40" />
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 32% 28%, color-mix(in oklab, var(--foreground) 40%, transparent) 0%, transparent 55%)",
                    boxShadow:
                      "inset 0 2px 2px color-mix(in oklab, var(--foreground) 20%, transparent), inset 0 -6px 12px color-mix(in oklab, var(--foreground) 12%, transparent)",
                  }}
                />
              </div>
              <span className="font-mono text-[11px] text-fd-muted-foreground">
                fixed glint
              </span>
            </div>

            <div
              className="lgla-el flex flex-col items-center gap-2"
              style={{ "--d": "200ms" } as CSSProperties}
            >
              <div
                className="size-24 rounded-full border border-fd-border bg-[var(--card)]"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, var(--foreground) 0%, transparent 50%, var(--foreground) 100%)",
                  opacity: 0.55,
                }}
              />
              <span className="font-mono text-[11px] text-fd-muted-foreground">
                band=0
              </span>
            </div>
          </div>

          <p className="max-w-[40ch] text-center text-[13px] text-fd-muted-foreground">
            Glint stays at{" "}
            <span className="font-mono text-[12px]">32% / 28%</span> — a sphere
            highlight, not a pointer sheen. The map ramps edge-to-edge (
            <span className="font-mono text-[12px]">band=0</span>), unlike the
            card&apos;s neutral mid.
          </p>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="size-3.5 rounded-full bg-[var(--muted)]/60 ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Frost
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                blur + saturate + optional url(#filter)
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="size-3.5 rounded-full bg-[var(--foreground)]/20 ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Glint
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                fixed radial · not pointer-tracked
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="size-3.5 rounded-full bg-[var(--foreground)]/55 ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Full map
              </dt>
              <dd className="font-mono text-[12px] text-fd-muted-foreground">
                buildDisplacementMap(size, size, 0)
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
