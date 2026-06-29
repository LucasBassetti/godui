"use client";

import { Sk } from "./_kit";

export default function SegmentedControlPreview() {
  return (
    <div className="relative flex h-9 w-44 items-center rounded-lg bg-[var(--muted-foreground)]/15 p-1">
      <div className="absolute top-1 left-1 h-7 w-[calc(33%-0.25rem)] rounded-md bg-primary transition-[left] duration-300 group-hover:left-[calc(66%-0.25rem)]" />
      <div className="relative grid w-full grid-cols-3 place-items-center">
        <Sk className="h-2 w-8 rounded-full" />
        <Sk className="h-2 w-8 rounded-full" />
        <Sk className="h-2 w-8 rounded-full" />
      </div>
    </div>
  );
}
