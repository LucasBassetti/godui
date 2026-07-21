"use client";

import { CoverFlow } from "@godui/components";

/**
 * Closing "here's the finished thing" panel — the real, interactive Cover
 * Flow. Drag across the stage, click a side slide, or use the arrow keys.
 */
const COVERS = [
  { title: "Nightfall", artist: "Aurora Grey", img: "1043" },
  { title: "Golden Hour", artist: "Marlowe", img: "1025" },
  { title: "Deep Field", artist: "Vesper", img: "1039" },
  { title: "Slow Tide", artist: "Costa", img: "1015" },
  { title: "Paper Moons", artist: "Halden", img: "1050" },
];

function Cover({ title, artist, img }: (typeof COVERS)[number]) {
  return (
    <div className="relative size-full select-none">
      <img
        src={`https://picsum.photos/id/${img}/500/500`}
        alt={title}
        className="absolute inset-0 size-full object-cover"
        draggable={false}
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <p className="text-xs text-white/70">{artist}</p>
      </div>
    </div>
  );
}

export function CoverFlowResult() {
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
        <CoverFlow defaultIndex={2} itemWidth={220} itemHeight={220}>
          {COVERS.map((c) => (
            <Cover key={c.title} {...c} />
          ))}
        </CoverFlow>
      </div>
    </div>
  );
}
