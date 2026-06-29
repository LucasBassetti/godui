"use client";

import { Ac } from "./_kit";

export default function SlideConfirmButtonPreview() {
  return (
    <div className="relative h-9 w-44 rounded-full bg-[var(--muted-foreground)]/20">
      <Ac className="absolute top-1 left-1 size-7 rounded-full transition-[left] duration-700 ease-out group-hover:left-[calc(100%-2rem)]" />
    </div>
  );
}
