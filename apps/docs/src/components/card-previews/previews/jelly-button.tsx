"use client";

import { Ac } from "./_kit";

export default function JellyButtonPreview() {
  return (
    <div className="relative flex h-10 w-32 items-end justify-center">
      <Ac className="h-9 w-32 origin-bottom rounded-xl transition-transform duration-300 [transition-timing-function:cubic-bezier(0.3,0.7,0.4,1.5)] group-hover:[transform:scaleX(1.13)_scaleY(0.87)]" />
    </div>
  );
}
