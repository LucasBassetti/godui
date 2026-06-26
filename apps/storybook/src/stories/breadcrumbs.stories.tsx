import { Breadcrumbs } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const items = [
  { label: "Home", href: "/" },
  { label: "Components", href: "/components" },
  { label: "Navigation", href: "/components/navigation" },
  { label: "Breadcrumbs" },
];

const meta = {
  title: "Navigation/Breadcrumbs",
  component: Breadcrumbs,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { items },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Collapsed: Story = {
  args: {
    maxItems: 3,
    items: [
      { label: "Home", href: "/" },
      { label: "Workspace", href: "/w" },
      { label: "Projects", href: "/w/p" },
      { label: "GodUI", href: "/w/p/godui" },
      { label: "Settings", href: "/w/p/godui/settings" },
      { label: "Billing" },
    ],
  },
};
