"use client";

import { Ac, Panel, Sk } from "./_kit";

export default function ComboboxPreview() {
  return (
    <div className="w-44">
      <Panel className="flex h-9 items-center justify-between px-3">
        <Sk className="h-2 w-20 rounded-full" />
        <Sk className="size-2 rounded-sm" />
      </Panel>
      <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 group-hover:grid-rows-[1fr]">
        <div className="overflow-hidden">
          <Panel className="mt-1.5 space-y-1.5 p-2">
            <Ac className="h-2 w-full rounded-full" />
            <Sk className="h-2 w-3/4 rounded-full" />
            <Sk className="h-2 w-5/6 rounded-full" />
          </Panel>
        </div>
      </div>
    </div>
  );
}
