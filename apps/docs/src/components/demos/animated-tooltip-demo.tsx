"use client";

import { AnimatedTooltip } from "@godui/components";
import { Bold, Code, Italic, Link, Underline } from "lucide-react";
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
  {
    name: "Katherine Johnson",
    role: "Product Design",
    initials: "KJ",
    gradient: "from-sky-500 to-cyan-500",
  },
  {
    name: "Linus Carlsson",
    role: "Frontend Lead",
    initials: "LC",
    gradient: "from-fuchsia-500 to-pink-500",
  },
];

const TOOLS: { label: string; Icon: ComponentType<{ className?: string }> }[] =
  [
    { label: "Bold", Icon: Bold },
    { label: "Italic", Icon: Italic },
    { label: "Underline", Icon: Underline },
    { label: "Link", Icon: Link },
    { label: "Code", Icon: Code },
  ];

export function AnimatedTooltipDemo() {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-10 py-2">
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          Crafted by design engineers
        </p>
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
      </div>

      <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1.5 shadow-sm">
        {TOOLS.map(({ label, Icon }) => (
          <AnimatedTooltip key={label} content={label}>
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
  );
}
