"use client";

import { useReducedMotion } from "framer-motion";
import { type ComponentType, type ReactNode, useState } from "react";
import { cn } from "@/lib/cn";

export type GalleryItem = {
  slug: string;
  title: string;
  description: string;
  Demo: ComponentType;
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
      className="grid size-full cursor-pointer place-items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset"
    >
      {children}
    </button>
  );
}

export function MotionCard({ item }: { item: GalleryItem }) {
  const { title, description, Demo } = item;

  return (
    <article aria-label={`${title} — motion guideline`} className={CARD}>
      <div className="relative grid aspect-[16/10] place-items-center overflow-hidden border-border border-b bg-muted/40">
        <Demo />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-semibold text-base text-foreground">{title}</h3>
        <p className="mt-1.5 text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </article>
  );
}
