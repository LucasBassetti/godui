import { MaskButton, type MaskButtonProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Buttons/Mask Button",
  component: MaskButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof MaskButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Nature: Story = {
  args: {
    children: "Hover me",
    mask: "nature",
  } satisfies MaskButtonProps,
};

export const Secondary: Story = {
  args: {
    children: "Hover me",
    mask: "nature",
    variant: "secondary",
  } satisfies MaskButtonProps,
};

export const Urban: Story = {
  args: {
    children: "Hover me",
    mask: "urban",
  } satisfies MaskButtonProps,
};

export const Forest: Story = {
  args: {
    children: "Hover me",
    mask: "forest",
  } satisfies MaskButtonProps,
};

export const Disabled: Story = {
  args: {
    children: "Hover me",
    mask: "nature",
    disabled: true,
  } satisfies MaskButtonProps,
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <MaskButton size="sm">Small</MaskButton>
      <MaskButton size="md">Medium</MaskButton>
      <MaskButton size="lg">Large</MaskButton>
    </div>
  ),
};
