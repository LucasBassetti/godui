"use client";

import { MorphGallery } from "@godui/components";

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * MorphGallery. Click a tile and watch the shared image morph into the
 * detail view; step with the arrows or the keyboard, close to morph back.
 */
const PHOTOS = [
  { id: "1011", caption: "Alpine switchbacks" },
  { id: "1016", caption: "Fog over the valley" },
  { id: "1021", caption: "Desert monolith" },
  { id: "1033", caption: "Harbor lights" },
  { id: "1040", caption: "Pine ridge" },
  { id: "1057", caption: "River bend" },
];

export function MorphGalleryResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — click a tile
        </span>
      </div>
      <div className="relative flex min-h-[280px] items-center justify-center p-6 sm:p-10">
        <MorphGallery
          columns={3}
          className="max-w-md"
          items={PHOTOS.map((p) => ({
            src: `https://picsum.photos/id/${p.id}/900/900`,
            alt: p.caption,
            caption: p.caption,
          }))}
        />
      </div>
    </div>
  );
}
