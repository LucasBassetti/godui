"use client";

import { Dock, DockItem } from "@godui/components";
import {
  Calendar,
  Folder,
  Home,
  Mail,
  Search,
  Settings,
  Wifi,
} from "lucide-react";
import type { ComponentType } from "react";

type Item = {
  label: string;
  color: string;
  Icon: ComponentType<{ className?: string; strokeWidth?: number }>;
};

const items: Item[] = [
  { label: "Home", color: "text-indigo-500", Icon: Home },
  { label: "Search", color: "text-emerald-500", Icon: Search },
  { label: "Files", color: "text-amber-500", Icon: Folder },
  { label: "Mail", color: "text-sky-500", Icon: Mail },
  { label: "Calendar", color: "text-rose-500", Icon: Calendar },
  { label: "Settings", color: "text-zinc-500", Icon: Settings },
];

export function DockDemo() {
  return (
    <div className="relative h-[380px] w-full overflow-hidden rounded-xl border border-border">
      {/* Wallpaper */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,oklch(0.55_0.18_265),oklch(0.62_0.16_320)_45%,oklch(0.7_0.12_25))]" />
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(255,255,255,0.25),transparent)]" />

      {/* Menu bar */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-1.5 text-xs font-medium text-white/95 [text-shadow:0_1px_2px_rgba(0,0,0,0.25)]">
        <div className="flex items-center gap-4">
          <span className="font-semibold"></span>
          <span className="font-semibold">Finder</span>
          <span className="hidden sm:inline">File</span>
          <span className="hidden sm:inline">Edit</span>
          <span className="hidden sm:inline">View</span>
        </div>
        <div className="flex items-center gap-3">
          <Wifi className="size-4" strokeWidth={2} />
          <Search className="size-4" strokeWidth={2} />
          <span className="tabular-nums">9:41</span>
        </div>
      </div>

      {/* Floating window */}
      <div className="absolute left-1/2 top-14 w-[78%] max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border border-white/20 bg-card/90 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <span className="size-3 rounded-full bg-red-400" />
          <span className="size-3 rounded-full bg-amber-400" />
          <span className="size-3 rounded-full bg-emerald-400" />
          <span className="ml-2 text-xs font-medium text-muted-foreground">
            Overview
          </span>
        </div>
        <div className="flex">
          <div className="hidden w-32 shrink-0 space-y-1.5 border-r border-border p-3 sm:block">
            {["Dashboard", "Projects", "Team", "Reports"].map((s, i) => (
              <div
                key={s}
                className={`rounded-md px-2 py-1 text-xs ${i === 0 ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground"}`}
              >
                {s}
              </div>
            ))}
          </div>
          <div className="flex-1 space-y-3 p-4">
            <div className="grid grid-cols-3 gap-2">
              {[
                { k: "MRR", v: "$48.2k" },
                { k: "Users", v: "12,840" },
                { k: "Churn", v: "1.2%" },
              ].map((stat) => (
                <div
                  key={stat.k}
                  className="rounded-lg border border-border p-2"
                >
                  <div className="text-[10px] uppercase text-muted-foreground">
                    {stat.k}
                  </div>
                  <div className="text-sm font-semibold tabular-nums text-foreground">
                    {stat.v}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex h-16 items-end gap-1.5">
              {[45, 62, 50, 78, 64, 90, 72, 84].map((h, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: static chart
                  key={`${h}-${i}`}
                  className="flex-1 rounded-sm bg-primary/70"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dock */}
      <div className="absolute inset-x-0 bottom-4 flex justify-center px-4">
        <Dock>
          {items.map(({ label, color, Icon }) => (
            <DockItem key={label} label={label}>
              <Icon className={`size-1/2 ${color}`} strokeWidth={2} />
            </DockItem>
          ))}
        </Dock>
      </div>
    </div>
  );
}
