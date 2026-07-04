"use client";

import { Ac, Sk } from "./_kit";

export default function CoverFlowPreview() {
  return (
    <div className="relative h-24 w-40 [perspective:600px]">
      <div className="absolute inset-0 flex items-center justify-center [transform-style:preserve-3d]">
        <div className="absolute size-16 origin-right -translate-x-10 overflow-hidden rounded-lg border border-border bg-card opacity-60 [transform:rotateY(45deg)] transition-transform duration-500 group-hover:-translate-x-14">
          <Sk className="size-full" />
        </div>
        <div className="absolute size-16 origin-left translate-x-10 overflow-hidden rounded-lg border border-border bg-card opacity-60 [transform:rotateY(-45deg)] transition-transform duration-500 group-hover:translate-x-14">
          <Sk className="size-full" />
        </div>
        <div className="absolute size-20 overflow-hidden rounded-lg border border-border bg-card shadow-xl transition-transform duration-500 group-hover:scale-105">
          <Ac className="h-full w-full" />
        </div>
      </div>
    </div>
  );
}
