"use client";

import { Dock, DockItem } from "@godui/components";
import { Calendar, Folder, Home, Mail, Search, Settings } from "lucide-react";
import type { ComponentType } from "react";
import { DemoScene } from "@/components/demos/_kit";

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
    <DemoScene className="min-h-[380px]">
      {/* Mid-stage content — padded below workbench title/tools, above the dock */}
      <div className="relative z-[1] flex min-h-0 flex-1 flex-col items-center justify-center px-5 pt-36 pb-4 sm:pt-40">
        <div className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
          <div className="flex items-center gap-2 border-border border-b px-3 py-2">
            <span className="size-3 rounded-full bg-red-400" />
            <span className="size-3 rounded-full bg-amber-400" />
            <span className="size-3 rounded-full bg-emerald-400" />
            <span className="ml-2 font-medium text-muted-foreground text-xs">
              Overview
            </span>
          </div>
          <div className="flex">
            <div className="hidden w-28 shrink-0 space-y-1.5 border-border border-r p-3 sm:block">
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
                    <div className="text-[10px] text-muted-foreground uppercase">
                      {stat.k}
                    </div>
                    <div className="font-semibold text-foreground text-sm tabular-nums">
                      {stat.v}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex h-14 items-end gap-1.5">
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
      </div>

      {/* Dock */}
      <div className="relative z-10 flex shrink-0 justify-center px-4 pb-5 pt-2">
        <Dock>
          {items.map(({ label, color, Icon }) => (
            <DockItem key={label} label={label}>
              <Icon className={`size-1/2 ${color}`} strokeWidth={2} />
            </DockItem>
          ))}
        </Dock>
      </div>
    </DemoScene>
  );
}
