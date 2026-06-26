import { MegaMenu, type MegaMenuItem } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { action, hidden, range } from "../playground/argtypes";

const items: MegaMenuItem[] = [
  {
    label: "Products",
    sections: [
      {
        heading: "Build",
        links: [
          {
            label: "Editor",
            href: "/editor",
            description: "Write and ship code fast",
          },
          {
            label: "Deploy",
            href: "/deploy",
            description: "Global edge deployments",
          },
        ],
      },
      {
        heading: "Scale",
        links: [
          {
            label: "Analytics",
            href: "/analytics",
            description: "Real-time product insight",
          },
          {
            label: "Security",
            href: "/security",
            description: "SOC 2 by default",
          },
        ],
      },
    ],
  },
  {
    label: "Resources",
    sections: [
      {
        links: [
          { label: "Docs", href: "/docs", description: "Guides and reference" },
          { label: "Blog", href: "/blog", description: "Product news" },
        ],
      },
    ],
  },
  { label: "Pricing", href: "/pricing" },
];

const meta = {
  title: "Navigation/Mega Menu",
  component: MegaMenu,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="flex h-80 w-full items-start justify-center pt-6">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    items: hidden(),
    openDelay: range(0, 400, 20, "Behavior"),
    closeDelay: range(0, 600, 20, "Behavior"),
    onNavigate: action("navigate"),
  },
  args: { items, openDelay: 80, closeDelay: 160, onNavigate: fn() },
} satisfies Meta<typeof MegaMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
