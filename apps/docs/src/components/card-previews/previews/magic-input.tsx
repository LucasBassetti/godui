"use client";

import { Panel, Sk } from "./_kit";

export default function MagicInputPreview() {
  return (
    <Panel className="flex h-10 w-48 items-center px-3 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:ring-2 group-hover:ring-primary">
      <Sk className="h-2 w-20 rounded-full" />
      <span className="ml-1 h-4 w-px bg-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
    </Panel>
  );
}
