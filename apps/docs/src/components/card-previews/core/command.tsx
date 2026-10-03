"use client";

import { Ac, Panel, Sk } from "../previews/_kit";

/** Core card preview: GPU-only (translate / scale / opacity), plays on card hover. */
export default function CommandPreview() {
  return (
    <Panel className="flex w-48 flex-col gap-1 p-2">
      <Sk className="mb-1 h-4 w-full rounded-md" />
      <div className="relative flex flex-col gap-1">
        <Ac className="absolute inset-x-0 top-0 h-5 rounded-md opacity-25 transition-[translate,scale,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-12" />
        {[24, 32, 20, 28].map((w) => (
          <div key={w} className="relative flex h-5 items-center px-1.5">
            <div
              className="h-1.5 rounded-full bg-[var(--muted-foreground)]/20"
              style={{ width: w * 3 }}
            />
          </div>
        ))}
      </div>
    </Panel>
  );
}
