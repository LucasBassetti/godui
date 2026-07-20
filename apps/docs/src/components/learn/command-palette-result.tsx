"use client";

import { type CommandGroup, CommandPalette } from "@godui/components";
import { useState } from "react";

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * CommandPalette. Open it (button or ⌘K / Ctrl+K), type to filter, arrow-key
 * through the results and watch the highlight spring between rows, and hit
 * Enter or Escape.
 */
export function CommandPaletteResult() {
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState<string | null>(null);

  const groups: CommandGroup[] = [
    {
      heading: "Navigation",
      items: [
        {
          id: "home",
          label: "Go to Home",
          shortcut: "G H",
          icon: "⌂",
          onSelect: () => setLast("Go to Home"),
        },
        {
          id: "docs",
          label: "Search Docs",
          shortcut: "G D",
          icon: "⌕",
          keywords: ["help"],
          onSelect: () => setLast("Search Docs"),
        },
        {
          id: "settings",
          label: "Open Settings",
          shortcut: "⌘,",
          icon: "⚙",
          onSelect: () => setLast("Open Settings"),
        },
      ],
    },
    {
      heading: "Actions",
      items: [
        {
          id: "new",
          label: "Create New File",
          shortcut: "⌘N",
          icon: "＋",
          onSelect: () => setLast("Create New File"),
        },
        {
          id: "theme",
          label: "Toggle Theme",
          icon: "◐",
          keywords: ["dark", "light"],
          onSelect: () => setLast("Toggle Theme"),
        },
      ],
    },
  ];

  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — try ⌘K / Ctrl+K
        </span>
      </div>
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 p-10">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm"
        >
          Open command palette
          <kbd className="rounded border border-border px-1.5 py-0.5 text-muted-foreground text-xs">
            ⌘K
          </kbd>
        </button>
        <p className="text-muted-foreground text-xs">
          {last ? (
            <>
              Selected: <span className="text-foreground">{last}</span>
            </>
          ) : (
            "Open the palette and run a command"
          )}
        </p>
      </div>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        groups={groups}
        enableShortcut
      />
    </div>
  );
}
