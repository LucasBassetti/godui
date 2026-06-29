"use client";

import { Sk } from "./_kit";

export default function ScrollRevealPreview() {
  return (
    <div className="grid h-24 w-36 place-items-center rounded-xl border border-border bg-card">
      <div className="w-full space-y-2 px-4 transition-all duration-500 [transform:translateY(0.5rem)] [opacity:0.25] group-hover:[opacity:1] group-hover:[transform:translateY(0)]">
        <Sk className="h-2 w-2/3 rounded-full" />
        <Sk className="h-1.5 w-full rounded-full" />
        <Sk className="h-1.5 w-5/6 rounded-full" />
      </div>
    </div>
  );
}
