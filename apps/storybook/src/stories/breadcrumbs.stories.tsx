import { Breadcrumbs } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { action, hidden, range, toggle } from "../playground/argtypes";
import { centered } from "../playground/stage";

const items = [
  { label: "Home", href: "/" },
  { label: "Workspace", href: "/w" },
  { label: "Projects", href: "/w/p" },
  { label: "GodUI", href: "/w/p/godui" },
  { label: "Settings", href: "/w/p/godui/settings" },
  { label: "Billing" },
];

const meta = {
  title: "Navigation/Breadcrumbs",
  component: Breadcrumbs,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [centered()],
  argTypes: {
    items: hidden(),
    separator: hidden(),
    maxItems: range(0, 8, 1, "Behavior"),
    collapsible: toggle("Behavior"),
    onNavigate: action("navigate"),
  },
  args: { items, maxItems: 4, collapsible: true, onNavigate: fn() },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
