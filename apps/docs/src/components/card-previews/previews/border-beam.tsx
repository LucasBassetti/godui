"use client";

import { Sk } from "./_kit";

export default function BorderBeamPreview() {
  return (
    <div className="relative h-24 w-36 space-y-2 overflow-hidden rounded-xl border border-border bg-card p-3">
      <Sk className="h-2 w-16 rounded-full" />
      <Sk className="h-1.5 w-24 rounded-full" />
      <Sk className="h-1.5 w-20 rounded-full" />
      <span className="-translate-x-10 absolute top-0 left-0 h-0.5 w-10 bg-primary transition-transform duration-700 ease-linear group-hover:translate-x-36" />
    </div>
  );
}
