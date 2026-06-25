import { Switch } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Controls/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const On: Story = { args: { defaultChecked: true } };
export const Small: Story = { args: { size: "sm", defaultChecked: true } };
export const Large: Story = { args: { size: "lg", defaultChecked: true } };
export const Disabled: Story = {
  args: { disabled: true, defaultChecked: true },
};
