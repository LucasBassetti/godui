"use client";

import { Ac, Sk } from "./_kit";

export default function TiltCardPreview() {
  return (
    <div className="[perspective:600px]">
      <div className="h-24 w-36 space-y-2 rounded-2xl border border-border bg-card p-4 shadow-md transition-transform duration-300 [transform-style:preserve-3d] group-hover:[transform:rotateX(8deg)_rotateY(-12deg)]">
        <Ac className="size-7 rounded-xl" />
        <Sk className="h-2 w-2/3 rounded-full" />
        <Sk className="h-1.5 w-full rounded-full" />
      </div>
    </div>
  );
}
