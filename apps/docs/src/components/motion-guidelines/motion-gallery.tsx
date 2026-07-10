"use client";

import { type GalleryItem, MotionCard } from "./motion-card";

export function MotionGallery({ items }: { items: GalleryItem[] }) {
  return (
    <div className="not-prose mt-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {items.map((item) => (
          <MotionCard key={item.slug} item={item} />
        ))}
      </div>
    </div>
  );
}
