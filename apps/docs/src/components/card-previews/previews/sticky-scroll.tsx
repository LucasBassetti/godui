"use client";

import { Ac, Panel, Sk } from "./_kit";

export default function StickyScrollPreview() {
  return (
    <div className="flex h-24 w-40 items-center gap-3">
      <div className="flex flex-1 flex-col gap-2">
        <Sk className="h-2 w-full rounded-full opacity-40 transition-opacity duration-500 group-hover:opacity-100" />
        <Ac className="h-2 w-3/4 rounded-full" />
        <Sk className="h-2 w-full rounded-full opacity-100 transition-opacity duration-500 group-hover:opacity-40" />
      </div>
      <Panel className="relative flex h-20 flex-1 items-center justify-center overflow-hidden">
        <Ac className="size-8 rounded-md transition-transform duration-500 ease-out group-hover:translate-y-6" />
      </Panel>
    </div>
  );
}
