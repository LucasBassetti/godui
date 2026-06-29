"use client";

import { Ac, Panel, Sk } from "./_kit";

export default function PromptSuggestionsPreview() {
  return (
    <div className="grid w-48 grid-cols-2 gap-2">
      {[0, 1].map((i) => (
        <Panel
          key={i}
          className="space-y-2 p-2.5 transition-colors duration-200 group-hover:border-primary/50"
        >
          <Ac className="size-6 rounded-lg" />
          <Sk className="h-1.5 w-full rounded-full" />
          <Sk className="h-1.5 w-2/3 rounded-full" />
        </Panel>
      ))}
    </div>
  );
}
