import { DropdownMenu, type DropdownMenuItem } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

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
  args: { trigger, items },
  decorators: [
    (Story) => (
      <div className="flex h-72 items-start justify-center pt-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const AlignEnd: Story = { args: { align: "end" } };
export const SideRight: Story = { args: { side: "right" } };
