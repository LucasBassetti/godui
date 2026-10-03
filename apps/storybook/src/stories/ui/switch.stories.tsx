import { Switch } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "UI/Switch",
  component: Switch,
  tags: ["autodocs"],
  args: { "aria-label": "Airplane mode" },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Small: Story = { args: { size: "sm" } };
export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2 text-foreground">
      <Switch id="airplane-mode" />
      <label htmlFor="airplane-mode" className="text-sm font-medium">
        Airplane Mode
      </label>
    </div>
  ),
};
