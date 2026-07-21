"use client";

import { OrbitCarousel } from "@godui/components";

/**
 * Closing "here's the finished thing" panel — the real, interactive Orbit
 * Carousel. Drag the wheel, click a side slide, or use the arrow keys.
 */
const CARDS = [
  { title: "Aurora", img: "1041" },
  { title: "Basalt", img: "1047" },
  { title: "Cirrus", img: "1052" },
  { title: "Drift", img: "1059" },
  { title: "Ember", img: "1069" },
];

function OrbitCard({ title, img }: (typeof CARDS)[number]) {
  return (
    <div className="relative size-full select-none">
      <img
        src={`https://picsum.photos/id/${img}/320/400`}
        alt={title}
        className="absolute inset-0 size-full object-cover"
        draggable={false}
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-3">
        <h3 className="font-semibold text-sm text-white">{title}</h3>
      </div>
    </div>
  );
}

export function OrbitCarouselResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — drag, click a side slide, or the arrow keys
        </span>
      </div>
      <div className="relative flex min-h-[360px] items-center justify-center p-6 md:min-h-[420px] md:p-10">
        <OrbitCarousel defaultIndex={2} radius={230} angleStep={26}>
          {CARDS.map((c) => (
            <OrbitCard key={c.title} {...c} />
          ))}
        </OrbitCarousel>
      </div>
    </div>
  );
}
