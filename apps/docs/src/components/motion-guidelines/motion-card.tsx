"use client";

import { useReducedMotion } from "framer-motion";
import { type ComponentType, type ReactNode, useState } from "react";
import { cn } from "@/lib/cn";
import { type MotionOrigin, OriginLogos } from "./origin-logos";

export type GalleryItem = {
  slug: string;
  title: string;
  description: string;
  Demo: ComponentType;
  /** Source canon behind the principle (patterns omit this). */
  origins?: MotionOrigin[];
  /** For patterns: the principle this recipe serves (principles omit this). */
  serves?: string;
};

const CARD = cn(
  "group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm",
  "[transition:box-shadow_300ms_ease,border-color_300ms_ease]",
  "hover:border-foreground/20 hover:shadow-md",
);

/**
 * One-shot trigger for tap-to-play demos: `play` drives the animation, `start`
 * fires it (on click), `done` resets it (on completion). Respects reduced motion.
 */
export function useOneShot() {
  const reduce = useReducedMotion();
  const [on, setOn] = useState(false);
  return {
    play: on && !reduce,
    start: () => setOn(true),
    done: () => setOn(false),
  };
}

/**
 * A play-button glyph used as the pointer cursor over tap-to-play demos, so it
 * reads as "click anywhere to play". White disc + dark triangle stays legible on
 * both light and dark card backgrounds. Hotspot centered on the 32px glyph.
 */
const PLAY_CURSOR_SVG = encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">' +
    '<circle cx="16" cy="16" r="14" fill="rgba(255,255,255,0.92)" stroke="rgba(0,0,0,0.8)" stroke-width="1.5"/>' +
    '<path d="M13 10.5l9 5.5-9 5.5z" fill="rgba(0,0,0,0.85)"/>' +
    "</svg>",
);
const PLAY_CURSOR = `url("data:image/svg+xml,${PLAY_CURSOR_SVG}") 16 16, pointer`;

/** Full-bleed clickable wrapper that triggers a demo's one-shot animation. */
export function TapToPlay({
  children,
  label,
  onTap,
}: {
  children: ReactNode;
  label: string;
  onTap: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onTap}
      aria-label={label}
      style={{ cursor: PLAY_CURSOR }}
      className="grid size-full place-items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset"
    >
      {children}
    </button>
  );
}

export function MotionCard({ item }: { item: GalleryItem }) {
  const { title, description, Demo, origins, serves } = item;

  return (
    <article aria-label={`${title} — motion guideline`} className={CARD}>
      <div className="relative grid aspect-[16/10] place-items-center overflow-hidden border-border border-b bg-muted/40">
        <Demo />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-base text-foreground">{title}</h3>
          {origins && origins.length > 0 && <OriginLogos origins={origins} />}
          {serves && (
            <span className="inline-flex shrink-0 items-center self-center whitespace-nowrap rounded-full border border-border bg-muted/50 px-2.5 py-0 font-medium text-[11px] leading-4 text-muted-foreground">
              {serves}
            </span>
          )}
        </div>
        <p className="mt-1.5 text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </article>
  );
}
