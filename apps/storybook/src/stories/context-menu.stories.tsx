import { ContextMenu, type ContextMenuItem } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { hidden } from "../playground/argtypes";
import { centered } from "../playground/stage";

const items: ContextMenuItem[] = [
  { type: "label", label: "Actions" },
  { label: "Cut", shortcut: "⌘X", onSelect: () => {} },
  { label: "Copy", shortcut: "⌘C", onSelect: () => {} },
  { label: "Paste", shortcut: "⌘V", onSelect: () => {} },
  { type: "separator" },
  { label: "Rename", onSelect: () => {} },
  { label: "Delete", destructive: true, shortcut: "⌫", onSelect: () => {} },
];

const meta = {
  title: "Navigation/Context Menu",
  component: ContextMenu,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [centered()],
  argTypes: {
    items: hidden(),
    children: hidden(),
  },
  args: {
    items,
    children: (
      <div className="flex h-44 w-80 select-none items-center justify-center rounded-2xl border border-border border-dashed bg-muted/40 text-muted-foreground text-sm">
        Right-click anywhere here
      </div>
    ),
  },
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
