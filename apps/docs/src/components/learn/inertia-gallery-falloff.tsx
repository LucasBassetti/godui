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

const LEGEND = [
  {
    name: "Scale",
    desc: "1 − distance × 0.14 × falloff",
    kind: "scale" as const,
  },
  {
    name: "Opacity",
    desc: "clamped 0.4–1",
    kind: "opacity" as const,
  },
  {
    name: "Blur",
    desc: "0 when reduced-motion",
    kind: "blur" as const,
  },
] as const;

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "opacity") {
    return (
      <span className="h-4 w-2.5 rounded-lg bg-[var(--foreground)]/45 ring-1 ring-fd-border ring-inset" />
    );
  }
  if (kind === "blur") {
    return (
      <span className="h-4 w-2.5 rounded-lg bg-[var(--foreground)]/20 blur-[2px] ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="h-4 w-2.5 rounded-lg bg-[var(--foreground)] ring-1 ring-fd-border ring-inset" />
  );
}

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
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <LegendSwatch kind={item.kind} />
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
