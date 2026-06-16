import { VariableText, type VariableTextProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Text/VariableText",
  component: VariableText,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    children: "Design for Humans",
    preset: "breathing",
    duration: 4,
  } satisfies VariableTextProps,
} satisfies Meta<typeof VariableText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Breathing: Story = {
  args: {
    preset: "breathing",
    duration: 4,
    children: "Design for Humans",
    className: "text-4xl tracking-tight",
  },
};

export const WeightPulse: Story = {
  args: {
    preset: "weight-pulse",
    children: "Build faster.",
    className: "text-5xl tracking-tight",
  },
};

export const WeightWave: Story = {
  args: {
    preset: "weight-wave",
    stagger: 0.05,
    children: "MAGIC UI",
    className: "text-5xl tracking-widest",
  },
};

export const Accordion: Story = {
  args: {
    preset: "accordion",
    duration: 3,
    children: "METRICS",
    className: "text-4xl uppercase",
  },
};

export const ItalicSway: Story = {
  args: {
    preset: "italic-sway",
    duration: 5,
    children: "Elegant motion for editorial layouts.",
    className: "text-2xl font-sans",
  },
};

export const Focus: Story = {
  args: {
    preset: "focus",
    duration: 6,
    children: "VARIABLE",
    className: "text-5xl tracking-tight",
  },
};

export const Elastic: Story = {
  args: {
    preset: "elastic",
    children: "Elastic Type",
    className: "text-4xl tracking-tight",
  },
};

export const ElasticHover: Story = {
  args: {
    preset: "elastic",
    trigger: "hover",
    children: "Hover Me",
    className: "text-4xl cursor-pointer",
  },
};

export const Cursor: Story = {
  args: {
    preset: "cursor",
    children: "Move Your Mouse",
    className: "text-4xl cursor-default",
  },
  parameters: {
    layout: "padded",
  },
};

export const Scroll: Story = {
  args: {
    preset: "scroll",
    children: "The Future Is Variable",
    className: "text-5xl tracking-tight",
  },
  decorators: [
    (Story) => (
      <div style={{ height: "200vh", paddingTop: "80vh" }}>
        <Story />
      </div>
    ),
  ],
};

export const CustomAxes: Story = {
  args: {
    weight: [300, 900],
    width: [80, 120],
    duration: 3,
    children: "Variable Typography",
    className: "text-4xl font-sans",
  },
};

export const ClickTrigger: Story = {
  args: {
    preset: "elastic",
    trigger: "click",
    children: "Click to Animate",
    className: "text-4xl cursor-pointer",
  },
};
