"use client";

import { type Facet, FilterBar, type FilterValue } from "@godui/components";
import { useState } from "react";

const facets: Facet[] = [
  {
    id: "status",
    label: "Status",
    options: [
      { label: "Backlog", value: "backlog", count: 24 },
      { label: "In progress", value: "progress", count: 8 },
      { label: "In review", value: "review", count: 5 },
      { label: "Done", value: "done", count: 132 },
    ],
  },
  {
    id: "priority",
    label: "Priority",
    options: [
      { label: "Urgent", value: "urgent", count: 3 },
      { label: "High", value: "high", count: 12 },
      { label: "Medium", value: "medium", count: 41 },
      { label: "Low", value: "low", count: 18 },
    ],
  },
  {
    id: "assignee",
    label: "Assignee",
    options: [
      { label: "Ada Lovelace", value: "ada", count: 14 },
      { label: "Linus T.", value: "linus", count: 22 },
      { label: "Grace Hopper", value: "grace", count: 9 },
    ],
  },
];

const ISSUES = [
  {
    id: "ENG-241",
    title: "Token refresh races on slow networks",
    status: "progress",
    priority: "urgent",
    assignee: "ada",
  },
  {
    id: "ENG-238",
    title: "Sidebar rail flickers on hover",
    status: "review",
    priority: "high",
    assignee: "linus",
  },
  {
    id: "ENG-230",
    title: "Add keyboard nav to combobox",
    status: "done",
    priority: "medium",
    assignee: "grace",
  },
  {
    id: "ENG-225",
    title: "Mega menu panel height jump",
    status: "progress",
    priority: "high",
    assignee: "linus",
  },
  {
    id: "ENG-219",
    title: "Breadcrumb overflow popover a11y",
    status: "backlog",
    priority: "low",
    assignee: "ada",
  },
];

const dot: Record<string, string> = {
  urgent: "bg-red-500",
  high: "bg-amber-500",
  medium: "bg-blue-500",
  low: "bg-muted-foreground/50",
};

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * FilterBar. Open a facet, toggle a few options, and watch the list below
 * narrow live; the "Clear all" affordance only appears once a filter is set.
 *
 * Note: the outer chrome intentionally skips `overflow-hidden` — each facet
 * popover is a `position: absolute` sibling, so clipping the frame would
 * clip the open popover too.
 */
export function FilterBarResult() {
  const [value, setValue] = useState<FilterValue>({ status: ["progress"] });

  const matches = ISSUES.filter((issue) =>
    Object.entries(value).every(([facetId, vals]) =>
      vals.length === 0
        ? true
        : vals.includes((issue as Record<string, string>)[facetId]),
    ),
  );

  return (
    <div className="not-prose my-8 rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — toggle a facet, watch the list narrow
        </span>
      </div>
      <div className="flex w-full flex-col items-center p-10">
        <div className="w-full max-w-lg rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between gap-3 border-border border-b px-4 py-3">
            <span className="font-semibold text-foreground text-sm">
              Issues
            </span>
            <span className="text-muted-foreground text-xs tabular-nums">
              {matches.length} of {ISSUES.length}
            </span>
          </div>
          <div className="border-border border-b px-4 py-3">
            <FilterBar facets={facets} value={value} onChange={setValue} />
          </div>
          <ul className="divide-y divide-border overflow-hidden rounded-b-xl">
            {matches.map((issue) => (
              <li
                key={issue.id}
                className="flex items-center gap-3 px-4 py-3 text-sm"
              >
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${dot[issue.priority]}`}
                />
                <span className="font-mono text-muted-foreground text-xs">
                  {issue.id}
                </span>
                <span className="truncate text-foreground">{issue.title}</span>
              </li>
            ))}
            {matches.length === 0 && (
              <li className="px-4 py-10 text-center text-muted-foreground text-sm">
                No issues match these filters.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
