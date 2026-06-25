import { OTPInput } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Inputs/OTP Input",
  component: OTPInput,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof OTPInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { length: 6 } };
export const FourDigit: Story = { args: { length: 4 } };
export const Masked: Story = { args: { length: 6, mask: true } };
export const Alphanumeric: Story = {
  args: { length: 5, type: "alphanumeric" },
};
export const Errored: Story = { args: { length: 6, status: "error" } };
export const Success: Story = { args: { length: 6, status: "success" } };
export const Disabled: Story = { args: { length: 6, disabled: true } };
