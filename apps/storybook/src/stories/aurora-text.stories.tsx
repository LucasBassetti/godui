import { AuroraText, type AuroraTextProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Text/AuroraText",
  component: AuroraText,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    children: "Aurora",
    className: "text-6xl font-bold tracking-tight",
  } satisfies AuroraTextProps,
} satisfies Meta<typeof AuroraText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Rainbow: Story = {
  args: {
    children: "Aurora",
    className: "text-6xl font-bold tracking-tight",
  },
};

export const Fast: Story = {
  args: {
    children: "Lightspeed",
    speed: 3,
    className: "text-6xl font-bold tracking-tight",
  },
};

export const CustomColors: Story = {
  args: {
    children: "Sunset",
    colors: ["#ff512f", "#dd2476", "#ff512f"],
    className: "text-6xl font-bold tracking-tight",
  },
};
