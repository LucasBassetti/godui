"use client";

import { Ac, Panel, Sk } from "./_kit";

export default function FloatingToolbarPreview() {
  return (
    <Panel className="flex h-11 items-center gap-2 rounded-xl px-2.5 shadow-md transition-transform duration-300 group-hover:-translate-y-1">
      <Ac className="size-5 rounded-md" />
      <Sk className="size-5 rounded-md" />
      <Sk className="size-5 rounded-md" />
      <span className="h-5 w-px bg-border" />
      <Sk className="size-5 rounded-md" />
    </Panel>
  );
}
