"use client";

import { Ac } from "./_kit";

const stars = [
  "top-3 left-5 group-hover:-translate-x-3 group-hover:-translate-y-3",
  "top-4 right-5 group-hover:translate-x-3 group-hover:-translate-y-3",
  "bottom-4 left-6 group-hover:-translate-x-3 group-hover:translate-y-3",
  "right-6 bottom-3 group-hover:translate-x-3 group-hover:translate-y-3",
  "top-1/2 left-3 group-hover:-translate-x-4",
  "top-1/2 right-3 group-hover:translate-x-4",
];

export default function WarpStarfieldPreview() {
  return (
    <div className="relative grid size-24 place-items-center overflow-hidden rounded-xl bg-[var(--muted-foreground)]/10">
      {stars.map((s) => (
        <span
          key={s}
          className={`absolute size-1.5 rounded-full bg-[var(--muted-foreground)]/40 transition-transform duration-500 ${s}`}
        />
      ))}
      <Ac className="size-3 rounded-full" />
    </div>
  );
}
