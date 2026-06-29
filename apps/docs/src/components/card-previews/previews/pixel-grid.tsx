"use client";

import { Ac } from "./_kit";

export default function PixelGridPreview() {
  return (
    <div className="relative size-24 rounded-xl bg-[radial-gradient(oklch(0.7_0_0/0.25)_1.5px,transparent_1.5px)] [background-size:12px_12px] ring-1 ring-border ring-inset">
      <Ac className="absolute top-4 left-4 size-2 rounded-[2px] transition-transform duration-300 group-hover:scale-150" />
    </div>
  );
}
