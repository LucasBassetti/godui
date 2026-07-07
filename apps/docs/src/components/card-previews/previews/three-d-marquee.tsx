"use client";

import { Ac, Sk } from "./_kit";

export default function ThreeDMarqueePreview() {
  return (
    <div className="flex h-24 w-40 items-center justify-center overflow-hidden [perspective:500px]">
      <div className="grid grid-cols-3 gap-1.5 [transform:rotateX(45deg)_rotateZ(-32deg)]">
        <div className="flex flex-col gap-1.5 transition-transform duration-500 ease-out group-hover:-translate-y-2">
          <Sk className="size-6 rounded" />
          <Sk className="size-6 rounded" />
          <Sk className="size-6 rounded" />
        </div>
        <div className="flex flex-col gap-1.5 transition-transform duration-500 ease-out group-hover:translate-y-2">
          <Sk className="size-6 rounded" />
          <Ac className="size-6 rounded" />
          <Sk className="size-6 rounded" />
        </div>
        <div className="flex flex-col gap-1.5 transition-transform duration-500 ease-out group-hover:-translate-y-2">
          <Sk className="size-6 rounded" />
          <Sk className="size-6 rounded" />
          <Sk className="size-6 rounded" />
        </div>
      </div>
    </div>
  );
}
