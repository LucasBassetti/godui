"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * `useTransform` maps each slide's distance-from-center through three
 * independent curves — scale, opacity, blur — so the falloff is a fixed
 * function of position, not a state per slide. Shown here as one static
 * graduated row rather than a loop: the curve itself doesn't move, only
 * which slide currently sits at each distance does.
 */
const CSS = `
@keyframes igf-in {
  from { opacity: 0; transform: translateY(8px) scale(var(--s)); }
  to   { opacity: var(--o); transform: translateY(0) scale(var(--s)); }
}
.igf-slide { animation: igf-in 650ms cubic-bezier(0.3, 0.7, 0.4, 1.2) var(--d) both; }
.igf-static .igf-slide { animation: none; opacity: var(--o); transform: scale(var(--s)); }
`;

type Slide = { d: number; scale: number; opacity: number; blur: number };

const SLIDES: Slide[] = [
  { d: -2, scale: 0.72, opacity: 0.4, blur: 5 },
  { d: -1, scale: 0.86, opacity: 0.7, blur: 3.2 },
  { d: 0, scale: 1, opacity: 1, blur: 0 },
  { d: 1, scale: 0.86, opacity: 0.7, blur: 3.2 },
  { d: 2, scale: 0.72, opacity: 0.4, blur: 5 },
];

export function InertiaGalleryFalloff() {
  return (
    <ScrollScene label="The falloff" note="distance → scale / opacity / blur">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[520px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`flex h-24 items-center justify-center gap-4 ${reduced ? "igf-static" : ""}`}
          >
            {SLIDES.map((s, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed positional demo row
                key={i}
                className="igf-slide h-16 w-11 shrink-0 rounded-lg bg-[var(--foreground)]"
                style={
                  {
                    "--s": s.scale,
                    "--o": s.opacity,
                    "--d": `${Math.abs(s.d) * 90}ms`,
                    filter: `blur(${s.blur}px)`,
                  } as CSSProperties
                }
              />
            ))}
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--foreground)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Scale
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                1 − distance × 0.14 × falloff
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--foreground)]/45 ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Opacity
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                clamped 0.4–1
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--foreground)]/20 ring-1 ring-fd-border ring-inset blur-[2px]" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Blur
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                0 when reduced-motion
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
