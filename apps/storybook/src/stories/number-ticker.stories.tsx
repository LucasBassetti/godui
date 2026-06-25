import { NumberTicker, type NumberTickerProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Text/NumberTicker",
  component: NumberTicker,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    value: 100,
    className: "text-6xl font-bold tracking-tight",
  } satisfies NumberTickerProps,
} satisfies Meta<typeof NumberTicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 100,
    className: "text-6xl font-bold tracking-tight",
  },
};

export const Decimals: Story = {
  args: {
    value: 1984.42,
    decimalPlaces: 2,
    className: "text-6xl font-bold tracking-tight",
  },
};

export const CountDown: Story = {
  args: {
    value: 100,
    direction: "down",
    className: "text-6xl font-bold tracking-tight",
  },
};

export const Delayed: Story = {
  args: {
    value: 5000,
    delay: 0.5,
    className: "text-6xl font-bold tracking-tight",
  },
};
