"use client";

import { Ac, Sk } from "../previews/_kit";

const DAYS = Array.from({ length: 28 }, (_, i) => i);

/** One month of dots; `pick` is the day whose fill pops in on hover. */
function Month({ pick }: { pick?: number }) {
  return (
    <div className="grid w-40 shrink-0 grid-cols-7 gap-x-1.5 gap-y-2 px-1">
      {DAYS.map((day) => (
        <div key={day} className="relative grid size-4 place-items-center">
          <Sk className="size-2 rounded-full" />
          {day === pick ? (
            <Ac className="absolute inset-0 scale-0 rounded-[4px] opacity-0 transition-[scale,opacity] delay-0 duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-100 group-hover:opacity-100 group-hover:delay-300" />
          ) : null}
        </div>
      ))}
    </div>
  );
}

/** Core card preview: GPU-only (translate / scale / opacity), plays on card hover. */
export default function CalendarPreview() {
  return (
    <div className="flex w-40 flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <Sk className="size-2 rounded-[2px]" />
        <Sk className="h-2 w-16 rounded-full" />
        <Sk className="size-2 rounded-[2px]" />
      </div>
      <div className="overflow-hidden">
        <div className="flex transition-[translate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-full">
          <Month />
          <Month pick={17} />
        </div>
      </div>
    </div>
  );
}
