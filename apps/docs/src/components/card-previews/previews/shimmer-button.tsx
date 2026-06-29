"use client";

import { Sk } from "./_kit";

export default function ShimmerButtonPreview() {
  return (
    <div className="relative">
      <Sk className="h-9 w-32 rounded-lg" />
      <div className="absolute -inset-0.5 rounded-[10px] opacity-0 ring-2 ring-primary transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}
