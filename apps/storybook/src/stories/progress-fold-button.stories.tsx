import {
  ProgressFoldButton,
  type ProgressFoldButtonProps,
} from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Buttons/Progress Fold Button",
  component: ProgressFoldButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ProgressFoldButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Hover & click",
    variant: "primary",
  } satisfies ProgressFoldButtonProps,
};

export const Secondary: Story = {
  args: {
    children: "Hover & click",
    variant: "secondary",
  } satisfies ProgressFoldButtonProps,
};

export const Disabled: Story = {
  args: {
    children: "Hover & click",
    variant: "primary",
    disabled: true,
  } satisfies ProgressFoldButtonProps,
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <ProgressFoldButton size="sm">Small</ProgressFoldButton>
      <ProgressFoldButton size="md">Medium</ProgressFoldButton>
      <ProgressFoldButton size="lg">Large</ProgressFoldButton>
    </div>
  ),
};
