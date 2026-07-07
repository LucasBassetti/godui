import { ScrollTimeline } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { padded } from "../playground/stage";

const DATA = [
  {
    date: "2021",
    title: "The first commit",
    content: (
      <p className="text-sm text-muted-foreground md:text-base">
        A single component and a big idea — a design system that feels alive.
      </p>
    ),
  },
  {
    date: "2023",
    title: "Ten thousand stars",
    content: (
      <p className="text-sm text-muted-foreground md:text-base">
        The community took over and the library tripled in a quarter.
      </p>
    ),
  },
  {
    date: "2025",
    title: "One hundred components",
    content: (
      <p className="text-sm text-muted-foreground md:text-base">
        Every surface got the same obsessive motion polish.
      </p>
    ),
  },
];

const meta = {
  title: "Visualizations/Scroll Timeline",
  component: ScrollTimeline,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [padded(880)],
  args: { data: DATA },
  render: (args) => <ScrollTimeline {...args} />,
} satisfies Meta<typeof ScrollTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
