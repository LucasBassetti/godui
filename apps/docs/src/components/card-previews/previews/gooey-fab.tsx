"use client";

import { Ac, Sk } from "./_kit";

export default function GooeyFabPreview() {
  return (
    <div className="relative flex h-16 w-44 items-center pl-2">
      <Sk className="absolute left-2 size-7 rounded-full transition-transform duration-300 group-hover:translate-x-9" />
      <Sk className="absolute left-2 size-7 rounded-full transition-transform duration-300 group-hover:translate-x-[68px]" />
      <Sk className="absolute left-2 size-7 rounded-full transition-transform duration-300 group-hover:translate-x-[100px]" />
      <Ac className="relative size-10 rounded-full" />
    </div>
  );
}
