"use client";

import { Ac, Sk } from "./_kit";

export default function MagicButtonPreview() {
  return (
    <div className="relative h-10 w-32">
      <Sk className="absolute inset-x-0 top-1.5 h-10 rounded-xl" />
      <Ac className="absolute inset-x-0 top-0 h-10 rounded-xl transition-transform duration-200 group-hover:translate-y-1.5" />
    </div>
  );
}
