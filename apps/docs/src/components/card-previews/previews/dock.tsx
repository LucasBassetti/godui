"use client";

import { Panel } from "./_kit";

export default function DockPreview() {
  return (
    <Panel className="flex h-14 items-end gap-2 rounded-2xl px-3 pb-2.5">
      <div className="size-7 origin-bottom rounded-lg bg-[var(--muted-foreground)]/20" />
      <div className="size-7 origin-bottom rounded-lg bg-[var(--muted-foreground)]/20 transition-transform duration-200 group-hover:scale-110" />
      <div className="size-7 origin-bottom rounded-lg bg-primary transition-transform duration-200 group-hover:scale-125" />
      <div className="size-7 origin-bottom rounded-lg bg-[var(--muted-foreground)]/20 transition-transform duration-200 group-hover:scale-110" />
      <div className="size-7 origin-bottom rounded-lg bg-[var(--muted-foreground)]/20" />
    </Panel>
  );
}
