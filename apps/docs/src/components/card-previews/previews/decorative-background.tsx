"use client";

import { Ac, Sk } from "./_kit";

export default function DecorativeBackgroundPreview() {
  return (
    <div className="relative size-24 overflow-hidden rounded-xl bg-[var(--muted-foreground)]/10">
      <Ac className="-right-4 -top-4 absolute size-12 rounded-full opacity-70 blur-[2px] transition-transform duration-500 group-hover:scale-125" />
      <Sk className="absolute bottom-3 left-3 size-6 rotate-12 rounded-md" />
      <Sk className="absolute bottom-5 left-12 size-3 rounded-full" />
    </div>
  );
}
