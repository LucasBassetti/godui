import { StickyScroll, type StickyScrollItem } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const ITEMS: StickyScrollItem[] = [
  {
    title: "Collaborate in real time",
    description:
      "Cursors, comments, and presence keep the whole team on the same page.",
    content: (
      <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 text-2xl font-semibold text-foreground">
        Collaborate
      </div>
    ),
  },
  {
    title: "Ship with confidence",
    description: "Preview every change and roll out when it feels right.",
    content: (
      <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/30 to-transparent text-2xl font-semibold text-foreground">
        Ship
      </div>
    ),
  },
  {
    title: "Scale calmly",
    description: "Infrastructure that grows with you, never against you.",
    content: (
      <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/25 text-2xl font-semibold text-foreground">
        Scale
      </div>
    ),
  },
];

const meta = {
  title: "Layout/Sticky Scroll",
  component: StickyScroll,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { items: ITEMS },
  render: (args) => <StickyScroll {...args} />,
} satisfies Meta<typeof StickyScroll>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
