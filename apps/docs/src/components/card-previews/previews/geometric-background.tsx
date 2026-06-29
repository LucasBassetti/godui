"use client";

import { Ac, Sk } from "./_kit";

export default function GeometricBackgroundPreview() {
  return (
    <div className="relative size-24 overflow-hidden rounded-xl bg-[var(--muted-foreground)]/10">
      <Sk className="absolute top-4 left-4 size-8 rotate-12 rounded-md" />
      <Ac className="absolute right-4 bottom-5 size-7 rounded-full transition-transform duration-500 group-hover:rotate-45" />
      <Sk className="absolute top-6 right-6 size-4 rotate-45" />
    </div>
  );
}
