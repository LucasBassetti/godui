import { Sidebar, type SidebarItem } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const dot = (
  <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
);

const items: SidebarItem[] = [
  { id: "home", label: "Home", href: "/", icon: dot },
  { id: "inbox", label: "Inbox", href: "/inbox", icon: dot, badge: "9" },
  {
    id: "projects",
    label: "Projects",
    icon: dot,
    children: [
      { id: "godui", label: "GodUI", href: "/p/godui" },
      { id: "acme", label: "Acme", href: "/p/acme" },
    ],
  },
  { id: "settings", label: "Settings", href: "/settings", icon: dot },
];

const meta = {
  title: "Navigation/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { items, activeId: "home", header: "GodUI" },
  decorators: [
    (Story) => (
      <div className="flex h-[420px] bg-muted/20">
        <Story />
        <div className="flex-1 p-8 text-muted-foreground text-sm">
          Hover the rail to expand it.
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Expanded: Story = { args: { defaultCollapsed: false } };
export const PinnedToggle: Story = {
  args: { expandOnHover: false, defaultCollapsed: false },
};
