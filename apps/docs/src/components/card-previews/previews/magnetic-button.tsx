"use client";

import { Ac, Sk } from "./_kit";

export default function MagneticButtonPreview() {
  return (
    <div className="flex items-center gap-5">
      <Sk className="h-9 w-28 rounded-lg transition-transform duration-300 group-hover:translate-x-2" />
      <Ac className="size-2.5 rounded-full transition-transform duration-300 group-hover:-translate-x-4" />
    </div>
  );
}
