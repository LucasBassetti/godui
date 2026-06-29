"use client";

import { Ac, Sk } from "./_kit";

export default function MorphingDialogPreview() {
  return (
    <div className="grid place-items-center">
      <div className="h-20 w-32 overflow-hidden rounded-2xl border border-border bg-card shadow-md transition-all duration-300 group-hover:h-28 group-hover:w-44 group-hover:shadow-xl">
        <Ac className="h-9 transition-all duration-300 group-hover:h-16" />
        <div className="space-y-1.5 p-2.5">
          <Sk className="h-2 w-2/3 rounded-full" />
          <Sk className="h-1.5 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}
