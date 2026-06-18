import { MagicInput, type MagicInputProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Inputs/Magic Input",
  component: MagicInput,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof MagicInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Focus me",
    variant: "primary",
  } satisfies MagicInputProps,
};

export const Secondary: Story = {
  args: {
    placeholder: "Focus me",
    variant: "secondary",
  } satisfies MagicInputProps,
};

export const AlwaysRaised: Story = {
  args: {
    placeholder: "Always 3D",
    depth: "always",
  } satisfies MagicInputProps,
};

export const WithoutRainbow: Story = {
  args: {
    placeholder: "Focus me",
    rainbow: false,
  } satisfies MagicInputProps,
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled",
    disabled: true,
  } satisfies MagicInputProps,
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <MagicInput size="sm" placeholder="Small" />
      <MagicInput size="md" placeholder="Medium" />
      <MagicInput size="lg" placeholder="Large" />
    </div>
  ),
};

export const WithSubmitButton: Story = {
  args: {
    placeholder: "Type and submit",
    onSubmit: (value: string) => alert(value),
  } satisfies MagicInputProps,
};

export const Playground: Story = {
  args: {
    placeholder: "Focus me",
    variant: "primary",
    size: "md",
    depth: "focus",
    rainbow: true,
  } satisfies MagicInputProps,
};
