"use client";

import { Ac, Sk } from "./_kit";

export default function MultiButtonPreview() {
  return (
    <div className="relative flex h-10 w-36 items-center justify-center rounded-full bg-[var(--muted-foreground)]/15 p-1">
      <div className="flex h-8 w-full items-center justify-between">
        <Sk className="mx-2 size-4 rounded-full" />
        <Ac className="h-8 w-20 rounded-full transition-transform duration-300 group-hover:scale-x-110" />
        <Sk className="mx-2 size-4 rounded-full" />
      </div>
    </div>
  );
}
