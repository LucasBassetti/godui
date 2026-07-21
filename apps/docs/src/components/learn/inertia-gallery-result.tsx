"use client";

import { InertiaGallery } from "@godui/components";

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * InertiaGallery. Throw the strip, or use the buttons / arrow keys.
 */
const SHOTS = [
  { label: "Dune", img: "1018" },
  { label: "Harbor", img: "1024" },
  { label: "Ridge", img: "1036" },
  { label: "Bloom", img: "1062" },
  { label: "Quartz", img: "1074" },
];

function Shot({ label, img }: (typeof SHOTS)[number]) {
  return (
    <div className="relative size-full select-none">
      <img
        src={`https://picsum.photos/id/${img}/400/533`}
        alt={label}
        className="absolute inset-0 size-full object-cover"
        draggable={false}
      />
      <span className="absolute bottom-3 left-3 rounded-md bg-black/50 px-2 py-0.5 text-xs font-medium text-white backdrop-blur">
        {label}
      </span>
    </div>
  );
}

export function InertiaGalleryResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — throw the strip, or use the buttons
        </span>
      </div>
      <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden p-6 sm:p-10">
        <InertiaGallery snap defaultIndex={2} itemWidth={200} gap={24}>
          {SHOTS.map((s) => (
            <Shot key={s.label} {...s} />
          ))}
        </InertiaGallery>
      </div>
    </div>
  );
}
