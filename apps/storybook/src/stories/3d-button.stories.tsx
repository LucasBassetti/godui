import { ThreeDButton, type ThreeDButtonProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Components/3D Button",
  component: ThreeDButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ThreeDButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Push me",
    variant: "default",
  } satisfies ThreeDButtonProps,
};

export const Secondary: Story = {
  args: {
    children: "Push me",
    variant: "secondary",
  } satisfies ThreeDButtonProps,
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <ThreeDButton size="sm">Small</ThreeDButton>
      <ThreeDButton size="default">Default</ThreeDButton>
      <ThreeDButton size="lg">Large</ThreeDButton>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    children: "Push me",
    variant: "default",
    size: "default",
    rainbow: true,
  } satisfies ThreeDButtonProps,
};

export const WithoutRainbow: Story = {
  args: {
    children: "Push me",
    variant: "default",
    rainbow: false,
  } satisfies ThreeDButtonProps,
};
