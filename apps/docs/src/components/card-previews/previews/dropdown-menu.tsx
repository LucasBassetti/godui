"use client";

import { Ac, Panel, Sk } from "./_kit";

export default function DropdownMenuPreview() {
  return (
    <div className="flex w-40 flex-col items-center">
      <Panel className="flex h-8 w-28 items-center justify-center gap-2 rounded-full">
        <Sk className="h-2 w-12 rounded-full" />
        <Sk className="size-1.5 rounded-sm" />
      </Panel>
      <div className="grid w-full grid-rows-[0fr] transition-[grid-template-rows] duration-300 group-hover:grid-rows-[1fr]">
        <div className="overflow-hidden">
          <Panel className="mt-1.5 space-y-1.5 p-2">
            <Sk className="h-2 w-3/4 rounded-full" />
            <Ac className="h-2 w-full rounded-full" />
            <Sk className="h-2 w-2/3 rounded-full" />
          </Panel>
        </div>
      </div>
    </div>
  );
}
