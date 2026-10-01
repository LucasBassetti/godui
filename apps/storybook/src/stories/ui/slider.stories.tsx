import { Slider } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "UI/Slider",
  component: Slider,
  tags: ["autodocs"],
  args: { defaultValue: [50], max: 100, step: 1, className: "w-80" },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Range: Story = { args: { defaultValue: [25, 75] } };
export const Vertical: Story = {
  args: { orientation: "vertical", className: "h-44" },
};
