"use client";

import { Ac, Panel, Sk } from "../previews/_kit";

/** Core card preview: GPU-only (translate / scale / opacity), plays on card hover. */
export default function SonnerPreview() {
  return (
    <div className="relative h-24 w-44">
      {[2, 1, 0].map((n) => (
        <Panel
          key={n}
          className={
            n === 0
              ? "absolute inset-x-0 bottom-0 flex h-9 items-center gap-2 px-2.5 transition-[translate,scale,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              : n === 1
                ? "absolute inset-x-0 bottom-0 h-9 -translate-y-2 scale-95 transition-[translate,scale,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-10 group-hover:scale-100"
                : "absolute inset-x-0 bottom-0 h-9 -translate-y-4 scale-90 transition-[translate,scale,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-20 group-hover:scale-100"
          }
        >
          {n === 0 ? (
            <>
              <Ac className="size-3 rounded-full" />
              <Sk className="h-1.5 w-24 rounded-full" />
            </>
          ) : null}
        </Panel>
      ))}
    </div>
  );
}
