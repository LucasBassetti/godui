"use client";

import { Ac, Sk } from "./_kit";

export default function BentoGridPreview() {
  return (
    <div className="grid h-24 w-40 grid-cols-3 grid-rows-2 gap-2">
      <Sk className="col-span-2 rounded-lg" />
      <Ac className="row-span-2 rounded-lg transition-transform duration-300 group-hover:scale-95" />
      <Sk className="col-span-2 rounded-lg" />
    </div>
  );
}
