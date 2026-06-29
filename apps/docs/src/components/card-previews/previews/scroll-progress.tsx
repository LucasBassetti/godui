"use client";

import { Sk } from "./_kit";

export default function ScrollProgressPreview() {
  return (
    <div className="relative h-24 w-40 space-y-2 overflow-hidden rounded-xl border border-border bg-card p-3 pt-4">
      <span className="absolute top-0 left-0 h-1 w-1/4 bg-primary transition-[width] duration-700 ease-linear group-hover:w-full" />
      <Sk className="h-2 w-1/2 rounded-full" />
      <Sk className="h-1.5 w-full rounded-full" />
      <Sk className="h-1.5 w-5/6 rounded-full" />
      <Sk className="h-1.5 w-2/3 rounded-full" />
    </div>
  );
}
