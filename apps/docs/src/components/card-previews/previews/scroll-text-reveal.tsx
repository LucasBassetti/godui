"use client";

import { Ac, Sk } from "./_kit";

const ROWS = [
  { w: "w-full", accent: false },
  { w: "w-11/12", accent: true },
  { w: "w-10/12", accent: false },
  { w: "w-2/3", accent: false },
];

export default function ScrollTextRevealPreview() {
  return (
    <div className="flex w-40 flex-col gap-2.5">
      {ROWS.map((row) => {
        const Bar = row.accent ? Ac : Sk;
        return (
          <Bar
            key={row.w}
            className={`h-2.5 rounded-full opacity-25 transition-opacity duration-300 group-hover:opacity-100 ${row.w}`}
          />
        );
      })}
    </div>
  );
}
