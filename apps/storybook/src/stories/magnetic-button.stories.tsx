import { MagneticButton, type MagneticButtonProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Buttons/Magnetic Button",
  component: MagneticButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "outline"],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    strength: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    range: { control: { type: "range", min: 0, max: 64, step: 4 } },
  },
} satisfies Meta<typeof MagneticButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Get started",
    variant: "default",
    size: "md",
    strength: 0.4,
  } satisfies MagneticButtonProps,
};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <MagneticButton variant="default">Default</MagneticButton>
      <MagneticButton variant="secondary">Secondary</MagneticButton>
      <MagneticButton variant="outline">Outline</MagneticButton>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <MagneticButton size="sm">Small</MagneticButton>
      <MagneticButton size="md">Medium</MagneticButton>
      <MagneticButton size="lg">Large</MagneticButton>
    </div>
  ),
};

export const StrongPull: Story = {
  args: {
    children: "Strong pull",
    strength: 0.8,
  } satisfies MagneticButtonProps,
};

export const WithSensorRange: Story = {
  args: {
    children: "Wide sensor",
    range: 48,
  } satisfies MagneticButtonProps,
};

export const StaticLabel: Story = {
  args: {
    children: "Label stays centered",
    variant: "secondary",
    range: 44,
    staticLabel: true,
  } satisfies MagneticButtonProps,
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  } satisfies MagneticButtonProps,
};
