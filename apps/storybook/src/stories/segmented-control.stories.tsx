import { SegmentedControl } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { action, hidden, select } from "../playground/argtypes";
import { centered } from "../playground/stage";

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
  decorators: [centered()],
  argTypes: {
    options: hidden(),
    value: hidden(),
    size: select(["sm", "md", "lg"], "Appearance"),
    defaultValue: select(["day", "week", "month"], "State"),
    onChange: action("change"),
  },
  args: {
    options,
    size: "md",
    defaultValue: "day",
    onChange: fn(),
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
