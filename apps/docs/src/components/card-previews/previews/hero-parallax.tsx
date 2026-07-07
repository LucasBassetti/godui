"use client";

import { Ac, Sk } from "./_kit";

export default function HeroParallaxPreview() {
  return (
    <div className="flex h-24 w-44 flex-col justify-center gap-2 overflow-hidden">
      <div className="flex gap-2 transition-transform duration-500 ease-out group-hover:-translate-x-3">
        <Sk className="h-5 w-14 rounded-md" />
        <Ac className="h-5 w-14 rounded-md" />
        <Sk className="h-5 w-14 rounded-md" />
      </div>
      <div className="flex gap-2 transition-transform duration-500 ease-out group-hover:translate-x-3">
        <Sk className="h-5 w-14 rounded-md" />
        <Sk className="h-5 w-14 rounded-md" />
        <Sk className="h-5 w-14 rounded-md" />
      </div>
      <div className="flex gap-2 transition-transform duration-500 ease-out group-hover:-translate-x-2">
        <Sk className="h-5 w-14 rounded-md" />
        <Sk className="h-5 w-14 rounded-md" />
        <Sk className="h-5 w-14 rounded-md" />
      </div>
    </div>
  );
}
