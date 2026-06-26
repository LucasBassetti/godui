import { ResizableHeader } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { action, hidden, range, toggle } from "../playground/argtypes";

const links = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
];

const cta = (
  <button
    type="button"
    className="rounded-full bg-primary px-4 py-1.5 font-medium text-primary-foreground text-sm"
  >
    Get started
  </button>
);

const meta = {
  title: "Navigation/Resizable Header",
  component: ResizableHeader,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="h-[150vh] bg-muted/30">
        <Story />
        <p className="px-6 pt-24 text-center text-muted-foreground text-sm">
          Scroll down — the bar morphs into a floating pill.
        </p>
      </div>
    ),
  ],
  argTypes: {
    logo: hidden(),
    links: hidden(),
    cta: hidden(),
    scrollRef: hidden(),
    sticky: toggle("Behavior"),
    scrollThreshold: range(0, 240, 10, "Behavior"),
    onNavigate: action("navigate"),
  },
  args: {
    links,
    activeHref: "/features",
    cta,
    sticky: true,
    scrollThreshold: 40,
    onNavigate: fn(),
  },
} satisfies Meta<typeof ResizableHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
