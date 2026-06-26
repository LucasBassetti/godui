import { DropdownMenu, type DropdownMenuItem } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { hidden, select } from "../playground/argtypes";

const items: DropdownMenuItem[] = [
  { type: "label", label: "My account" },
  { label: "Profile", shortcut: "⌘P", onSelect: () => {} },
  { label: "Settings", shortcut: "⌘,", onSelect: () => {} },
  {
    label: "Workspaces",
    submenu: [
      { label: "GodUI", onSelect: () => {} },
      { label: "Acme", onSelect: () => {} },
      { type: "separator" },
      { label: "New workspace", onSelect: () => {} },
    ],
  },
  { type: "separator" },
  { label: "Log out", onSelect: () => {} },
];

const trigger = (
  <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 font-medium text-foreground text-sm">
    Open menu
  </span>
);

const meta = {
  title: "Navigation/Dropdown Menu",
  component: DropdownMenu,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="flex h-72 items-start justify-center pt-4">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    trigger: hidden(),
    items: hidden(),
    side: select(["top", "bottom", "left", "right"], "Behavior"),
    align: select(["start", "center", "end"], "Behavior"),
  },
  args: { trigger, items, side: "bottom", align: "start" },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
