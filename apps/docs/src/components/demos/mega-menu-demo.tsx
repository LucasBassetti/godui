"use client";

import { MegaMenu } from "@godui/components";
import {
  BarChart3,
  BookOpen,
  Boxes,
  GitBranch,
  LifeBuoy,
  Newspaper,
  Rocket,
  ShieldCheck,
} from "lucide-react";

const items = [
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
          {
            label: "Support",
            href: "#support",
            description: "Talk to a human",
            icon: <LifeBuoy className="size-4" />,
          },
        ],
      },
    ],
  },
  { label: "Pricing", href: "#pricing" },
];

export function MegaMenuDemo() {
  return (
    <div className="flex h-96 w-full max-w-2xl items-start justify-center pt-4">
      <nav className="flex w-full items-center justify-between rounded-2xl border border-border bg-card px-4 py-2.5 shadow-sm">
        <span className="flex items-center gap-2 font-semibold text-foreground text-sm">
          <Boxes className="size-5 text-primary" />
          Northwind
        </span>
        <MegaMenu items={items} />
        <button
          type="button"
          className="rounded-full bg-primary px-4 py-1.5 font-medium text-primary-foreground text-sm"
        >
          Sign in
        </button>
      </nav>
    </div>
  );
}
