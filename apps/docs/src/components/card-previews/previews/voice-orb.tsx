"use client";

import { Ac } from "./_kit";

export default function VoiceOrbPreview() {
  return (
    <div className="relative grid size-20 place-items-center">
      <span className="absolute size-20 scale-75 rounded-full bg-primary/15 transition-transform duration-500 group-hover:scale-100" />
      <span className="absolute size-16 scale-75 rounded-full bg-primary/25 transition-transform duration-500 group-hover:scale-100" />
      <Ac className="size-10 rounded-full transition-transform duration-500 group-hover:scale-110" />
    </div>
  );
}
