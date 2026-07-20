"use client";

import { MegaMenu, type MegaMenuItem } from "@godui/components";
import {
  BarChart3,
  BookOpen,
  GitBranch,
  Newspaper,
  Rocket,
  ShieldCheck,
} from "lucide-react";

const ITEMS: MegaMenuItem[] = [
  {
    label: "Product",
    sections: [
      {
        heading: "Build",
        links: [
          {
            label: "Editor",
            href: "#editor",
            description: "Write and ship code fast",
            icon: <GitBranch className="size-4" />,
          },
          {
            label: "Deploy",
            href: "#deploy",
            description: "Global edge deployments",
            icon: <Rocket className="size-4" />,
          },
        ],
      },
      {
        heading: "Scale",
        links: [
          {
            label: "Analytics",
            href: "#analytics",
            description: "Real-time product insight",
            icon: <BarChart3 className="size-4" />,
          },
          {
            label: "Security",
            href: "#security",
            description: "SOC 2 by default",
            icon: <ShieldCheck className="size-4" />,
          },
        ],
      },
    ],
  },
  {
    label: "Resources",
    sections: [
      {
        links: [
          {
            label: "Documentation",
            href: "#docs",
            description: "Guides and API reference",
            icon: <BookOpen className="size-4" />,
          },
          {
            label: "Changelog",
            href: "#changelog",
            description: "What shipped this week",
            icon: <Newspaper className="size-4" />,
          },
        ],
      },
    ],
  },
  { label: "Pricing", href: "#pricing" },
];

/**
 * Closing "here's the finished thing" panel — the real, interactive Mega
 * Menu. Hover a trigger to open the panel; move to the next panel trigger
 * and watch the highlight slide and the panel morph its footprint around
 * the new content. No `overflow-hidden` on the card — the panel is
 * `position: absolute` and would get clipped otherwise.
 */
export function MegaMenuResult() {
  return (
    <div className="not-prose my-8 rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-fd-border border-b px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          hover Product ↔ Resources — panel morphs between them
        </span>
      </div>
      <div className="flex min-h-[380px] items-start justify-center px-6 pt-8 pb-6">
        <MegaMenu items={ITEMS} />
      </div>
    </div>
  );
}
