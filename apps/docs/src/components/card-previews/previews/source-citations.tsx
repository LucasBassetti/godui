"use client";

import { Panel, Sk } from "./_kit";

function Cite() {
  return (
    <span className="inline-block size-3 rounded-[3px] bg-primary/30 align-super transition-colors duration-200 group-hover:bg-primary" />
  );
}

export default function SourceCitationsPreview() {
  return (
    <Panel className="w-48 p-3">
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
        <Sk className="h-2 w-16 rounded-full" />
        <Sk className="h-2 w-20 rounded-full" />
        <Cite />
        <Sk className="h-2 w-12 rounded-full" />
        <Sk className="h-2 w-24 rounded-full" />
        <Cite />
        <Sk className="h-2 w-14 rounded-full" />
      </div>
    </Panel>
  );
}
