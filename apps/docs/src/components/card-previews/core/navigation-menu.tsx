"use client";

import { Ac, Panel, Sk } from "../previews/_kit";

/** Core card preview: GPU-only (translate / opacity), plays on card hover. */
export default function NavigationMenuPreview() {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex items-center gap-1.5">
        <Sk className="h-5 w-12 rounded-md" />
        <div className="relative h-5 w-12 rounded-md">
          <Sk className="absolute inset-0 rounded-md" />
          <Ac className="absolute inset-0 rounded-md opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        <Sk className="h-5 w-12 rounded-md" />
      </div>
      <Panel className="relative h-14 w-40 overflow-hidden">
        <div className="absolute inset-0 flex flex-col gap-1.5 p-2.5 transition-[translate,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-6 group-hover:opacity-0">
          <Sk className="h-1.5 w-24 rounded-full" />
          <Sk className="h-1.5 w-16 rounded-full" />
          <Sk className="h-1.5 w-20 rounded-full" />
        </div>
        <div className="absolute inset-0 flex translate-x-6 flex-col gap-1.5 p-2.5 opacity-0 transition-[translate,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 group-hover:opacity-100">
          <Ac className="h-1.5 w-20 rounded-full" />
          <Sk className="h-1.5 w-28 rounded-full" />
          <Sk className="h-1.5 w-14 rounded-full" />
        </div>
      </Panel>
    </div>
  );
}
