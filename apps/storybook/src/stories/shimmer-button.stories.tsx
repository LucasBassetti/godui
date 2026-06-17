import { ShimmerButton, type ShimmerButtonProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Buttons/Shimmer Button",
  component: ShimmerButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ShimmerButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Shimmer",
    variant: "primary",
  } satisfies ShimmerButtonProps,
};

export const Secondary: Story = {
  args: {
    children: "Shimmer",
    variant: "secondary",
  } satisfies ShimmerButtonProps,
};

export const Outline: Story = {
  args: {
    children: "Shimmer",
    variant: "outline",
  } satisfies ShimmerButtonProps,
};

export const Disabled: Story = {
  args: {
    children: "Shimmer",
    variant: "primary",
    disabled: true,
  } satisfies ShimmerButtonProps,
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <ShimmerButton size="sm">Small</ShimmerButton>
      <ShimmerButton size="md">Medium</ShimmerButton>
      <ShimmerButton size="lg">Large</ShimmerButton>
    </div>
  ),
};

export const WithoutShimmer: Story = {
  args: {
    children: "Shimmer",
    variant: "primary",
    shimmer: false,
  } satisfies ShimmerButtonProps,
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16 }}>
      <ShimmerButton variant="primary">Primary</ShimmerButton>
      <ShimmerButton variant="secondary">Secondary</ShimmerButton>
      <ShimmerButton variant="outline">Outline</ShimmerButton>
    </div>
  ),
};
