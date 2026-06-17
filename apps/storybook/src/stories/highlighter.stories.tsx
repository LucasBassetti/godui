import { Highlighter, type HighlighterProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Text/Highlighter",
  component: Highlighter,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    children: "highlight",
    action: "highlight",
    className: "text-3xl font-sans",
  } satisfies HighlighterProps,
} satisfies Meta<typeof Highlighter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Highlight: Story = {
  args: {
    action: "highlight",
    children: "highlight",
  },
};

export const Underline: Story = {
  args: {
    action: "underline",
    color: "#60a5fa",
    children: "underline",
  },
};

export const Box: Story = {
  args: {
    action: "box",
    color: "#f59e0b",
    children: "box",
  },
};

export const Circle: Story = {
  args: {
    action: "circle",
    color: "#34d399",
    children: "circle",
  },
};

export const StrikeThrough: Story = {
  args: {
    action: "strike-through",
    color: "#f87171",
    children: "strike-through",
  },
};

export const CrossedOff: Story = {
  args: {
    action: "crossed-off",
    color: "#a78bfa",
    children: "crossed-off",
  },
};

export const Bracket: Story = {
  args: {
    action: "bracket",
    color: "#fb7185",
    children: "bracket",
  },
};

export const CustomColor: Story = {
  args: {
    action: "highlight",
    color: "#22d3ee",
    children: "custom color",
  },
};

export const InView: Story = {
  args: {
    action: "underline",
    isView: true,
    children: "Scroll into view to animate",
    className: "text-3xl font-sans",
  },
  decorators: [
    (Story) => (
      <div style={{ height: "200vh", paddingTop: "120vh" }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: "padded",
  },
};
