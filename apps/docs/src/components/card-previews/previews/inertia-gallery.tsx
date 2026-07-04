"use client";

import { Ac, Sk } from "./_kit";

export default function InertiaGalleryPreview() {
  return (
    <div className="flex h-24 w-full items-center justify-center gap-2">
      <Sk className="h-14 w-9 shrink-0 rounded-lg opacity-40 blur-[1px] transition-transform duration-500 group-hover:-translate-x-1" />
      <Sk className="h-16 w-10 shrink-0 rounded-lg opacity-70" />
      <div className="h-20 w-14 shrink-0 overflow-hidden rounded-lg border border-border shadow-lg transition-transform duration-500 group-hover:scale-105">
        <Ac className="size-full" />
      </div>
      <Sk className="h-16 w-10 shrink-0 rounded-lg opacity-70" />
      <Sk className="h-14 w-9 shrink-0 rounded-lg opacity-40 blur-[1px] transition-transform duration-500 group-hover:translate-x-1" />
    </div>
  );
}
