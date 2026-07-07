"use client";

import { Ac, Sk } from "./_kit";

export default function GravityPreview() {
  return (
    <div className="relative flex h-24 w-40 items-end justify-center gap-2 overflow-hidden rounded-lg border border-border pb-2">
      <Sk className="h-5 w-10 -translate-y-8 rounded-full transition-transform duration-500 ease-out group-hover:translate-y-0" />
      <Ac className="h-5 w-12 -translate-y-12 rounded-full transition-transform delay-75 duration-500 ease-out group-hover:translate-y-0" />
      <Sk className="h-5 w-8 -translate-y-6 rounded-full transition-transform delay-100 duration-500 ease-out group-hover:translate-y-0" />
      <Sk className="h-5 w-9 -translate-y-10 rounded-full transition-transform delay-150 duration-500 ease-out group-hover:translate-y-0" />
    </div>
  );
}
