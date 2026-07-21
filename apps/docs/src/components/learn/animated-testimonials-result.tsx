"use client";

import { AnimatedTestimonials } from "@godui/components";

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * AnimatedTestimonials. Watch the stack reshuffle and the quote blur in
 * word by word every 5 seconds, or drive it yourself with the arrows.
 */
const TESTIMONIALS = [
  {
    quote:
      "GodUI shipped the smoothest interactions I've put in production this year.",
    name: "Ada Lovelace",
    role: "Design Engineer, Analytical",
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80",
  },
  {
    quote: "Spring physics out of the box. Everything just feels expensive.",
    name: "Grace Hopper",
    role: "Staff Engineer, Compiler Co.",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80",
  },
];

export function AnimatedTestimonialsResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — wait, or use the arrows
        </span>
      </div>
      <div className="flex min-h-[280px] items-center justify-center p-10">
        <AnimatedTestimonials testimonials={TESTIMONIALS} />
      </div>
    </div>
  );
}
