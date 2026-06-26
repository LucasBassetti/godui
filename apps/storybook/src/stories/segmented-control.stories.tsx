import { SegmentedControl } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const options = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
];

const meta = {
  title: "Navigation/Segmented Control",
  component: SegmentedControl,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { options },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Small: Story = { args: { size: "sm" } };
export const Large: Story = { args: { size: "lg" } };
export const DefaultSelection: Story = { args: { defaultValue: "week" } };
