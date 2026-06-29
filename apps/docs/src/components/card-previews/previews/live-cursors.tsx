"use client";

import { Sk } from "./_kit";

export default function LiveCursorsPreview() {
  return (
    <div className="relative h-24 w-40 overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex gap-2 p-3">
        <Sk className="h-12 w-16 rounded-lg" />
        <Sk className="h-12 w-16 rounded-lg" />
      </div>
      <div className="absolute top-6 left-8 transition-transform duration-500 group-hover:translate-x-12 group-hover:translate-y-6">
        <svg
          viewBox="0 0 24 24"
          className="size-4 fill-primary"
          aria-hidden="true"
        >
          <path d="M5 3l14 7-6 2-2 6z" />
        </svg>
        <span className="ml-3 block h-1.5 w-8 rounded-full bg-primary" />
      </div>
    </div>
  );
}
