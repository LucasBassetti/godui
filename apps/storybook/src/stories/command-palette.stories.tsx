import { type CommandGroup, CommandPalette } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

const meta = {
  title: "Overlays/CommandPalette",
  component: CommandPalette,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { open: false, onOpenChange: () => {}, groups: [] },
} satisfies Meta<typeof CommandPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

const groups: CommandGroup[] = [
  {
    heading: "Navigation",
    items: [
      { id: "home", label: "Go to Home", shortcut: "G H", icon: "⌂" },
      { id: "docs", label: "Search Docs", shortcut: "G D", icon: "⌕" },
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

export const Default: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm"
        >
          Open palette (or press ⌘K)
        </button>
        <CommandPalette open={open} onOpenChange={setOpen} groups={groups} />
      </>
    );
  },
};
