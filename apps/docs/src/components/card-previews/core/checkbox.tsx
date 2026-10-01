"use client";

import { Ac, Sk } from "../previews/_kit";

/** Core card preview: GPU-only (translate / scale / opacity), plays on card hover. */
export default function CheckboxPreview() {
  return (
    <div className="flex flex-col gap-2.5">
      {[0, 1, 2].map((row) => (
        <div key={row} className="flex items-center gap-2.5">
          <div className="relative size-4 rounded-[4px] border border-[var(--muted-foreground)]/30">
            <Ac
              className={
                row === 0
                  ? "absolute -inset-px rounded-[4px]"
                  : row === 1
                    ? "absolute -inset-px scale-50 rounded-[4px] opacity-0 transition-[translate,scale,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100"
                    : "hidden"
              }
            />
          </div>
          <Sk className="h-2 w-24 rounded-full" />
        </div>
      ))}
    </div>
  );
}
