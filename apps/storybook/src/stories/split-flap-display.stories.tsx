import { SplitFlapDisplay } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { hidden, radio, range, select, text } from "../playground/argtypes";
import { centered } from "../playground/stage";

const meta = {
  title: "Layout/Split Flap Display",
  component: SplitFlapDisplay,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [centered()],
  argTypes: {
    value: text("Content"),
    length: range(0, 20, 1, "Appearance"),
    align: radio(["left", "center", "right"], "Appearance"),
    size: select(["sm", "md", "lg"], "Appearance"),
    stagger: range(0, 0.2, 0.01, "Behavior"),
    maxFlaps: range(1, 40, 1, "Behavior"),
    charset: hidden(),
    className: hidden(),
  },
  args: {
    value: "DEPARTURE",
    align: "left",
    size: "md",
    stagger: 0.06,
    maxFlaps: 12,
  },
} satisfies Meta<typeof SplitFlapDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Small: Story = {
  args: { value: "GATE 22 · ON TIME", size: "sm", length: 18 },
};

export const Large: Story = {
  args: { value: "GODUI", size: "lg" },
};

export const Numeric: Story = {
  args: { value: "13:45", size: "lg", charset: "0123456789" },
};
