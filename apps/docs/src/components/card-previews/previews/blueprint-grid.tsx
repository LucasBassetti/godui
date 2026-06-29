"use client";

import { Ac } from "./_kit";

export default function BlueprintGridPreview() {
  return (
    <div className="relative size-24 overflow-hidden rounded-xl border border-border bg-[linear-gradient(oklch(0.7_0_0/0.15)_1px,transparent_1px),linear-gradient(90deg,oklch(0.7_0_0/0.15)_1px,transparent_1px)] [background-size:12px_12px]">
      <Ac className="absolute top-3 left-3 size-3 rounded-sm transition-transform duration-500 group-hover:translate-x-9 group-hover:translate-y-9" />
    </div>
  );
}
