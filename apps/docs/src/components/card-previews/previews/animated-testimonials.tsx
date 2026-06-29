"use client";

import { Ac, Sk } from "./_kit";

export default function AnimatedTestimonialsPreview() {
  return (
    <div className="flex w-48 items-center gap-3">
      <Sk className="size-16 shrink-0 rounded-xl transition-transform duration-300 group-hover:-rotate-3" />
      <div className="flex-1 space-y-1.5">
        <Sk className="h-1.5 w-full rounded-full" />
        <Sk className="h-1.5 w-5/6 rounded-full" />
        <Sk className="h-1.5 w-2/3 rounded-full" />
        <div className="flex gap-1 pt-1">
          <Ac className="size-1.5 rounded-full" />
          <Sk className="size-1.5 rounded-full" />
          <Sk className="size-1.5 rounded-full" />
        </div>
      </div>
    </div>
  );
}
