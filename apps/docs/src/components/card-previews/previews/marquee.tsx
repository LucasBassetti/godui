"use client";

import { Ac, Sk } from "./_kit";

export default function MarqueePreview() {
  return (
    <div className="w-44 overflow-hidden">
      <div className="flex w-max gap-2.5 transition-transform duration-[1200ms] ease-linear group-hover:-translate-x-16">
        <Sk className="h-6 w-14 rounded-md" />
        <Ac className="h-6 w-14 rounded-md" />
        <Sk className="h-6 w-14 rounded-md" />
        <Sk className="h-6 w-14 rounded-md" />
        <Ac className="h-6 w-14 rounded-md" />
        <Sk className="h-6 w-14 rounded-md" />
      </div>
    </div>
  );
}
