"use client";

import { Ac, Sk } from "./_kit";

export default function FilterBarPreview() {
  return (
    <div className="flex w-48 flex-wrap items-center gap-2">
      <Sk className="h-7 w-16 rounded-full" />
      <Ac className="h-7 w-20 rounded-full transition-transform duration-300 group-hover:scale-105" />
      <Sk className="h-7 w-14 rounded-full" />
      <Sk className="h-7 w-12 rounded-full" />
    </div>
  );
}
