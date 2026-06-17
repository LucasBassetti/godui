import { ElasticText, type ElasticTextProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Text/ElasticText",
  component: ElasticText,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    children: "Design for Humans",
    mode: "auto",
  } satisfies ElasticTextProps,
} satisfies Meta<typeof ElasticText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Auto: Story = {
  args: {
    mode: "auto",
    children: "Design for Humans",
    className: "text-4xl tracking-tight",
  },
};

export const Hover: Story = {
  args: {
    mode: "hover",
    children: "Move Your Mouse",
    className: "text-4xl tracking-tight",
  },
};
