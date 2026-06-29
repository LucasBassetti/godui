"use client";

import { Panel, Sk } from "./_kit";

export default function CommandPalettePreview() {
  return (
    <Panel className="w-48">
      <div className="border-border border-b px-3 py-2.5">
        <Sk className="h-2 w-24 rounded-full" />
      </div>
      <div className="space-y-1 p-1.5">
        <div className="h-5 rounded-md bg-primary transition-colors duration-200 group-hover:bg-[var(--muted-foreground)]/20" />
        <div className="h-5 rounded-md bg-[var(--muted-foreground)]/20 transition-colors duration-200 group-hover:bg-primary" />
        <div className="h-5 rounded-md bg-[var(--muted-foreground)]/20" />
      </div>
    </Panel>
  );
}
