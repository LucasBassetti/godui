"use client";

import { Ac, Panel, Sk } from "./_kit";

export default function PromptComposerPreview() {
  return (
    <Panel className="flex h-14 w-48 flex-col justify-between p-2.5">
      <Sk className="h-2 w-28 rounded-full" />
      <div className="flex items-center justify-between">
        <Sk className="h-4 w-12 rounded-full" />
        <Ac className="size-7 rounded-lg transition-transform duration-200 group-hover:scale-110" />
      </div>
    </Panel>
  );
}
