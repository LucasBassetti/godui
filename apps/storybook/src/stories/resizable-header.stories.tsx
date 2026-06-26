import { ResizableHeader } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

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
  args: { links, activeHref: "/features", cta },
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
} satisfies Meta<typeof ResizableHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const NoCta: Story = { args: { cta: undefined } };
export const NonSticky: Story = { args: { sticky: false } };
