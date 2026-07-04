"use client";

import { MorphGallery } from "@godui/components";

const PHOTOS = [
  { id: "1002", caption: "Coastline at dawn" },
  { id: "1011", caption: "Alpine switchbacks" },
  { id: "1016", caption: "Fog over the valley" },
  { id: "1021", caption: "Desert monolith" },
  { id: "1033", caption: "Harbor lights" },
  { id: "1040", caption: "Pine ridge" },
  { id: "1044", caption: "Salt flats" },
  { id: "1057", caption: "River bend" },
  { id: "1068", caption: "Autumn canopy" },
];

export function MorphGalleryDemo() {
  return (
    <MorphGallery
      columns={3}
      items={PHOTOS.map((p) => ({
        src: `https://picsum.photos/id/${p.id}/900/900`,
        alt: p.caption,
        caption: p.caption,
      }))}
    />
  );
}
