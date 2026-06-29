"use client";

import { Ac, Sk } from "./_kit";

export default function DrawerPreview() {
  return (
    <div className="relative h-28 w-48 overflow-hidden rounded-xl border border-border bg-card">
      <div className="space-y-2 p-3">
        <Sk className="h-2 w-1/2 rounded-full" />
        <Sk className="h-2 w-full rounded-full" />
        <Sk className="h-2 w-2/3 rounded-full" />
      </div>
      <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/30" />
      <div className="absolute inset-y-0 right-0 w-2/3 translate-x-full space-y-2 border-border border-l bg-card p-3 transition-transform duration-300 group-hover:translate-x-0">
        <Ac className="h-2 w-1/2 rounded-full" />
        <Sk className="h-2 w-full rounded-full" />
        <Sk className="h-2 w-3/4 rounded-full" />
      </div>
    </div>
  );
}
