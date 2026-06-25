import { ConfettiButton } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Effects/Confetti",
  component: ConfettiButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ConfettiButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Button: Story = {
  args: {
    children: "Celebrate 🎉",
    className:
      "rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground",
  },
};

export const BigBurst: Story = {
  args: {
    children: "Big burst",
    className:
      "rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground",
    options: { particleCount: 250, spread: 120, startVelocity: 55 },
  },
};
