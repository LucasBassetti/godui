"use client";

import { Panel } from "./_kit";

export default function TabBarPreview() {
  return (
    <Panel className="flex h-12 w-48 items-center justify-around rounded-2xl px-2">
      <div className="size-5 rounded-md bg-primary transition-colors duration-200 group-hover:bg-[var(--muted-foreground)]/20" />
      <div className="size-5 rounded-md bg-[var(--muted-foreground)]/20 transition-colors duration-200 group-hover:bg-primary" />
      <div className="size-5 rounded-md bg-[var(--muted-foreground)]/20" />
      <div className="size-5 rounded-md bg-[var(--muted-foreground)]/20" />
    </Panel>
  );
}
