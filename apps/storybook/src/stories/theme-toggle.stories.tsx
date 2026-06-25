import { ThemeToggle } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Buttons/Theme Toggle",
  component: ThemeToggle,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SlowReveal: Story = {
  args: { duration: 900 },
};
