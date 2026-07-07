"use client";

import { Ac } from "./_kit";

const BEAMS = ["w-1/3", "w-1/2", "w-2/5", "w-1/4"] as const;

export default function BeamDrawPreview() {
  return (
    <div className="flex h-24 w-40 flex-col justify-center gap-3">
      {BEAMS.map((rest, i) => (
        <Ac
          // biome-ignore lint/suspicious/noArrayIndexKey: positional decorative bars.
          key={i}
          className={`h-1 ${rest} rounded-full transition-[width] duration-700 ease-out group-hover:w-full`}
        />
      ))}
    </div>
  );
}
