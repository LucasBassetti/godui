"use client";

import { Ac, Sk } from "./_kit";

export default function AnimatedBeamPreview() {
  return (
    <div className="relative flex h-24 w-44 items-center justify-between px-4">
      <span className="absolute top-1/2 right-12 left-12 h-px bg-[var(--muted-foreground)]/25" />
      <div className="flex flex-col gap-8">
        <Sk className="size-8 rounded-full" />
        <Sk className="size-8 rounded-full" />
      </div>
      <span className="absolute top-1/2 left-12 size-2 -translate-y-1/2 rounded-full bg-primary opacity-0 transition-all duration-500 group-hover:translate-x-20 group-hover:opacity-100" />
      <Ac className="size-10 rounded-full" />
    </div>
  );
}
