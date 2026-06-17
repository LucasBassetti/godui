import { MagicButton, type MagicButtonProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Buttons/Magic Button",
  component: MagicButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof MagicButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Push me",
    variant: "default",
  } satisfies MagicButtonProps,
};

export const Secondary: Story = {
  args: {
    children: "Push me",
    variant: "secondary",
  } satisfies MagicButtonProps,
};

export const Disabled: Story = {
  args: {
    children: "Push me",
    variant: "default",
    disabled: true,
  } satisfies MagicButtonProps,
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <MagicButton size="sm">Small</MagicButton>
      <MagicButton size="md">Medium</MagicButton>
      <MagicButton size="lg">Large</MagicButton>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    children: "Push me",
    variant: "default",
    size: "md",
    rainbow: true,
  } satisfies MagicButtonProps,
};

export const WithoutRainbow: Story = {
  args: {
    children: "Push me",
    variant: "default",
    rainbow: false,
  } satisfies MagicButtonProps,
};
