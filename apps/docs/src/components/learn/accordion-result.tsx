"use client";

import { Accordion } from "@godui/components";

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * Accordion. Click a trigger and watch the height spring settle while the
 * chevron rotates on its own flat ease.
 */
const FAQ_ITEMS = [
  {
    value: "what",
    title: "What is GodUI?",
    content:
      "A collection of animated React components built with Tailwind CSS and Framer Motion.",
  },
  {
    value: "install",
    title: "How do I install a component?",
    content: "Use the shadcn CLI to add any component into your project.",
  },
  {
    value: "license",
    title: "Is it free to use?",
    content: "Yes — copy, paste, and ship.",
  },
];

export function AccordionResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — open a question
        </span>
      </div>
      <div className="flex min-h-[240px] items-center justify-center p-10">
        <div className="w-full max-w-lg">
          <Accordion items={FAQ_ITEMS} defaultValue="what" />
        </div>
      </div>
    </div>
  );
}
