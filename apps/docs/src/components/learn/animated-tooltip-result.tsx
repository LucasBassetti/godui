"use client";

import { AnimatedTooltip } from "@godui/components";
import { Bold, Italic, Link, Underline } from "lucide-react";
import type { ComponentType } from "react";

type Member = {
  name: string;
  role: string;
  initials: string;
  gradient: string;
};

const TEAM: Member[] = [
  {
    name: "Ada Lovelace",
    role: "Design Engineer",
    initials: "AL",
    gradient: "from-indigo-500 to-violet-500",
  },
  {
    name: "Grace Hopper",
    role: "Staff Engineer",
    initials: "GH",
    gradient: "from-rose-500 to-orange-500",
  },
  {
    name: "Alan Turing",
    role: "Founder",
    initials: "AT",
    gradient: "from-emerald-500 to-teal-500",
  },
];

const TOOLS: { label: string; Icon: ComponentType<{ className?: string }> }[] =
  [
    { label: "Bold", Icon: Bold },
    { label: "Italic", Icon: Italic },
    { label: "Underline", Icon: Underline },
    { label: "Link", Icon: Link },
  ];

/**
 * The real, interactive `AnimatedTooltip` — hover or tab to any trigger to
 * see the mount spring and the pointer tilt from the sections above working
 * together. The icon row uses `side="bottom"` so both directions are on
 * screen at once.
 */
export function AnimatedTooltipResult() {
  return (
    <div className="not-prose my-8 rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          hover or tab to a trigger
        </span>
      </div>
      <div className="flex min-h-[300px] w-full flex-col items-center justify-center gap-12 p-10">
        <div className="flex">
          {TEAM.map((m) => (
            <AnimatedTooltip
              key={m.name}
              className="-ml-3 first:ml-0"
              content={
                <span className="flex flex-col">
                  <span className="font-semibold">{m.name}</span>
                  <span className="text-background/70">{m.role}</span>
                </span>
              }
            >
              <span
                className={`flex size-12 items-center justify-center rounded-full bg-gradient-to-br ${m.gradient} text-sm font-semibold text-white ring-2 ring-background`}
              >
                {m.initials}
              </span>
            </AnimatedTooltip>
          ))}
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1.5 shadow-sm">
          {TOOLS.map(({ label, Icon }) => (
            <AnimatedTooltip key={label} content={label} side="bottom">
              <button
                type="button"
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-lg text-muted-foreground [transition:background_200ms_ease,color_200ms_ease] hover:bg-accent hover:text-foreground"
              >
                <Icon className="size-4" />
              </button>
            </AnimatedTooltip>
          ))}
        </div>
      </div>
    </div>
  );
}
