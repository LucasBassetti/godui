"use client";

import { GooeyStack } from "@godui/components";
import * as React from "react";

function Mark({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`grid size-9 shrink-0 place-items-center rounded-lg text-sm font-bold ${className}`}
    >
      {children}
    </span>
  );
}

type Note = {
  key: string;
  title: string;
  body: string;
  time: string;
  mark: React.ReactNode;
};

const NOTES: Note[] = [
  {
    key: "slack",
    title: "Dana Lee",
    body: "Can you review the PR when you get a sec?",
    time: "5m",
    mark: <Mark className="bg-[#4A154B] text-white">S</Mark>,
  },
  {
    key: "linear",
    title: "Issue assigned to you",
    body: "GOD-142 · Fix card stacking",
    time: "2m",
    mark: <Mark className="bg-[#5E6AD2] text-white">L</Mark>,
  },
  {
    key: "github",
    title: "CI passed",
    body: "main · deploy is ready to ship",
    time: "now",
    mark: (
      <Mark className="bg-foreground text-background">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-5"
          aria-hidden="true"
        >
          <title>GitHub</title>
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      </Mark>
    ),
  },
];

function NoteCard({ note }: { note: Note }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3.5">
      {note.mark}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate text-sm font-semibold text-foreground">
            {note.title}
          </p>
          <span className="shrink-0 text-xs text-muted-foreground">
            {note.time}
          </span>
        </div>
        <p className="truncate text-sm text-muted-foreground">{note.body}</p>
      </div>
    </div>
  );
}

export function GooeyNotificationsDemo() {
  const [collapsed, setCollapsed] = React.useState(true);

  return (
    <div className="flex w-full max-w-[24rem] flex-col items-center gap-8 max-sm:px-4">
      <GooeyStack collapsed={collapsed} expandedGap={18} radius={22}>
        {NOTES.map((note) => (
          <NoteCard key={note.key} note={note} />
        ))}
      </GooeyStack>

      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        aria-pressed={!collapsed}
        className="rounded-full border border-border bg-card px-5 py-2 text-sm font-medium text-foreground [transition:background_150ms] hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {collapsed ? "Expand notifications" : "Stack notifications"}
      </button>
    </div>
  );
}
