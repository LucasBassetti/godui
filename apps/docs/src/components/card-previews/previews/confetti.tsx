"use client";

import { Sk } from "./_kit";

const bits = [
  "group-hover:-translate-x-10 group-hover:-translate-y-8",
  "group-hover:-translate-x-4 group-hover:-translate-y-12",
  "group-hover:translate-x-4 group-hover:-translate-y-12",
  "group-hover:translate-x-10 group-hover:-translate-y-8",
  "group-hover:-translate-x-8 group-hover:-translate-y-4",
  "group-hover:translate-x-8 group-hover:-translate-y-4",
];

export default function ConfettiPreview() {
  return (
    <div className="relative grid place-items-center">
      {bits.map((b, i) => (
        <span
          key={b}
          className={`absolute size-1.5 rounded-[1px] bg-primary opacity-0 transition-all duration-500 group-hover:opacity-100 ${b}`}
          style={{ transitionDelay: `${i * 30}ms` }}
        />
      ))}
      <Sk className="h-8 w-24 rounded-lg" />
    </div>
  );
}
