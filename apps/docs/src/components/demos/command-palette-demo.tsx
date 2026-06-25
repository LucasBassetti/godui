"use client";

import { type CommandGroup, CommandPalette } from "@godui/components";
import { useState } from "react";

const groups: CommandGroup[] = [
  {
    heading: "Navigation",
    items: [
      { id: "home", label: "Go to Home", shortcut: "G H", icon: "⌂" },
      {
        id: "docs",
        label: "Search Docs",
        shortcut: "G D",
        icon: "⌕",
        keywords: ["help"],
      },
      { id: "settings", label: "Open Settings", shortcut: "⌘,", icon: "⚙" },
    ],
  },
  {
    heading: "Actions",
    items: [
      { id: "new", label: "Create New File", shortcut: "⌘N", icon: "＋" },
      {
        id: "theme",
        label: "Toggle Theme",
        icon: "◐",
        keywords: ["dark", "light"],
      },
      { id: "copy", label: "Copy Link", shortcut: "⌘C", icon: "⧉" },
    ],
  },
];

export function CommandPaletteDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm"
      >
        Open command palette
        <kbd className="ml-2 rounded border border-border px-1.5 py-0.5 text-xs text-muted-foreground">
          ⌘K
        </kbd>
      </button>
      <CommandPalette open={open} onOpenChange={setOpen} groups={groups} />
    </>
  );
}
