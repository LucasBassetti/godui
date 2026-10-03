"use client";

import { Ac, Sk } from "../previews/_kit";

const DAYS = Array.from({ length: 28 }, (_, i) => i);
/** The range drawn in the incoming month: a pill at each end, a track between. */
const FROM = 9;
const TO = 12;
/** The track sweeps the middle days one after another (static classes). */
const SWEEP_DELAY = ["group-hover:delay-[420ms]", "group-hover:delay-[570ms]"];

/**
 * One month of dots. `range` (the incoming month) pops a pill at each end and
 * sweeps the track across the days between, left to right, after the month
 * has landed.
 */
function Month({ range = false }: { range?: boolean }) {
  return (
    <div className="grid w-40 grid-cols-7 gap-y-2 px-1">
      {DAYS.map((day) => {
        const end = range && (day === FROM || day === TO);
        const middle = range && day > FROM && day < TO;
        return (
          <div key={day} className="relative grid h-4 place-items-center">
            {middle ? (
              <Ac
                className={`absolute inset-0 origin-left scale-x-0 opacity-30 transition-[scale] delay-0 duration-150 ease-linear group-hover:scale-x-100 ${SWEEP_DELAY[day - FROM - 1]}`}
              />
            ) : null}
            <Sk className="relative size-2 rounded-full" />
            {end ? (
              <Ac className="absolute inset-0 m-auto size-4 scale-50 rounded-[4px] opacity-0 transition-[scale,opacity] delay-0 duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-100 group-hover:opacity-100 group-hover:delay-400" />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

/** Core card preview: GPU-only (translate / scale / opacity), plays on card hover. */
export default function CalendarPreview() {
  return (
    <div className="flex w-40 flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <Sk className="size-2 rounded-[2px]" />
        <div className="relative h-2 w-16">
          <Sk className="absolute inset-0 rounded-full transition-[opacity,translate] duration-150 ease-out group-hover:-translate-x-1 group-hover:opacity-0" />
          <Sk className="absolute inset-y-0 right-2 left-0 translate-x-2 rounded-full opacity-0 transition-[opacity,translate] delay-0 duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 group-hover:opacity-100 group-hover:delay-[60ms]" />
        </div>
        <Sk className="size-2 rounded-[2px]" />
      </div>
      <div className="relative overflow-hidden">
        {/* The old month leaves fast and short; the new one arrives a beat
            later from a quarter width away. */}
        <div className="transition-[opacity,translate] duration-150 ease-out group-hover:-translate-x-[12%] group-hover:opacity-0">
          <Month />
        </div>
        <div className="absolute inset-0 translate-x-1/4 opacity-0 transition-[opacity,translate] delay-0 duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 group-hover:opacity-100 group-hover:delay-[20ms]">
          <Month range />
        </div>
      </div>
    </div>
  );
}
