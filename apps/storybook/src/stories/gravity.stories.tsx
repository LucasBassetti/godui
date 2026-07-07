import { Gravity, MatterBody } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { padded } from "../playground/stage";

const TAGS = [
  "design",
  "motion",
  "physics",
  "react",
  "tailwind",
  "drag me",
  "wow",
];

const COLORS = [
  "bg-primary text-primary-foreground",
  "bg-foreground text-background",
  "bg-muted text-foreground",
];

const meta = {
  title: "Visualizations/Gravity",
  component: Gravity,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [padded(720)],
  render: (args) => (
    <Gravity
      {...args}
      className="h-[440px] w-full rounded-xl border border-border bg-muted/20"
    >
      {TAGS.map((label, i) => (
        <MatterBody
          key={label}
          x={`${15 + i * 10}%`}
          y={`${(i % 3) * 8}%`}
          angle={(i - 3) * 8}
        >
          <span
            className={`rounded-full px-5 py-2.5 text-lg font-medium shadow-sm ${COLORS[i % COLORS.length]}`}
          >
            {label}
          </span>
        </MatterBody>
      ))}
    </Gravity>
  ),
} satisfies Meta<typeof Gravity>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ZeroGravity: Story = {
  args: { gravity: { x: 0, y: 0 } },
};
