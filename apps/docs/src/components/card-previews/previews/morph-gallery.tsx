"use client";

import { Ac, Sk } from "./_kit";

export default function MorphGalleryPreview() {
  return (
    <div className="relative size-24">
      <div className="grid size-full grid-cols-3 gap-1.5">
        <Sk className="aspect-square rounded-md" />
        <Sk className="aspect-square rounded-md" />
        <Sk className="aspect-square rounded-md" />
        <Sk className="aspect-square rounded-md" />
        {/* This tile morphs up into the enlarged detail on hover. */}
        <div className="aspect-square rounded-md" />
        <Sk className="aspect-square rounded-md" />
        <Sk className="aspect-square rounded-md" />
        <Sk className="aspect-square rounded-md" />
        <Sk className="aspect-square rounded-md" />
      </div>
      <div className="absolute left-1/2 top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-md border border-border shadow-lg transition-all duration-500 group-hover:size-16">
        <Ac className="size-full" />
      </div>
    </div>
  );
}
