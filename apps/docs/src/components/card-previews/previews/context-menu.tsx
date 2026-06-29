"use client";

import { Panel } from "./_kit";

export default function ContextMenuPreview() {
  return (
    <Panel className="w-40 space-y-1.5 p-2">
      <div className="h-5 rounded-md bg-primary transition-colors duration-200 group-hover:bg-[var(--muted-foreground)]/20" />
      <div className="h-5 rounded-md bg-[var(--muted-foreground)]/20 transition-colors duration-200 group-hover:bg-primary" />
      <div className="h-5 rounded-md bg-[var(--muted-foreground)]/20" />
      <div className="h-px bg-border" />
      <div className="h-5 rounded-md bg-[var(--muted-foreground)]/20" />
    </Panel>
  );
}
