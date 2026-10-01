"use client";

import { Ac, Sk } from "../previews/_kit";

/** Core card preview: GPU-only (translate / scale / opacity), plays on card hover. */
export default function RadioGroupPreview() {
  return (
    <div className="flex flex-col gap-2.5">
      {[0, 1, 2].map((row) => (
        <div key={row} className="flex items-center gap-2.5">
          <div className="flex size-4 items-center justify-center rounded-full border border-[var(--muted-foreground)]/30">
            {row < 2 ? (
              <Ac
                className={
                  row === 0
                    ? "size-2 rounded-full transition-[translate,scale,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-0 group-hover:opacity-0"
                    : "size-2 scale-0 rounded-full opacity-0 transition-[translate,scale,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100"
                }
              />
            ) : null}
          </div>
          <Sk className="h-2 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}
