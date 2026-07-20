"use client";

import { Dock, DockItem } from "@godui/components";
import { Calendar, Folder, Home, Mail, Search, Settings } from "lucide-react";
import type { ComponentType } from "react";

/**
 * Closing "here's the finished thing" panel — the real, interactive Dock. Sweep
 * the pointer across the row and every item magnifies by its distance from the
 * cursor, neighbors rippling on the shared spring; hover one and its label rises.
 */
type Item = {
  label: string;
  color: string;
  Icon: ComponentType<{ className?: string; strokeWidth?: number }>;
};

const ITEMS: Item[] = [
  { label: "Home", color: "text-indigo-500", Icon: Home },
  { label: "Search", color: "text-emerald-500", Icon: Search },
  { label: "Files", color: "text-amber-500", Icon: Folder },
  { label: "Mail", color: "text-sky-500", Icon: Mail },
  { label: "Calendar", color: "text-rose-500", Icon: Calendar },
  { label: "Settings", color: "text-zinc-500", Icon: Settings },
];

export function DockResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — sweep the pointer across the row
        </span>
      </div>
      <div className="relative flex min-h-[260px] items-end justify-center overflow-hidden p-10">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,oklch(0.55_0.18_265),oklch(0.62_0.16_320)_45%,oklch(0.7_0.12_25))] opacity-90" />
        <div className="relative">
          <Dock>
            {ITEMS.map(({ label, color, Icon }) => (
              <DockItem key={label} label={label}>
                <Icon className={`size-1/2 ${color}`} strokeWidth={2} />
              </DockItem>
            ))}
          </Dock>
        </div>
      </div>
    </div>
  );
}
