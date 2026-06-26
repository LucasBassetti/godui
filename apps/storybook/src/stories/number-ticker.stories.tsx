import { NumberTicker } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { hidden, number, radio, range } from "../playground/argtypes";
import { centered } from "../playground/stage";

const meta = {
  title: "Text/NumberTicker",
  component: NumberTicker,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [centered()],
  argTypes: {
    value: number("Content"),
    startValue: number("Content"),
    direction: radio(["up", "down"], "Behavior"),
    delay: range(0, 3, 0.1, "Behavior"),
    decimalPlaces: range(0, 4, 1, "Appearance"),
    damping: range(10, 120, 5, "Behavior"),
    stiffness: range(20, 300, 10, "Behavior"),
    className: hidden(),
  },
  args: {
    value: 100,
    className: "text-6xl font-bold tracking-tight",
  },
} satisfies Meta<typeof NumberTicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
