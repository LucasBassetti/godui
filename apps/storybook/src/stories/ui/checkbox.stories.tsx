import { Checkbox } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  args: { "aria-label": "Accept terms" },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-3 text-foreground">
      <Checkbox id="terms" />
      <label htmlFor="terms" className="text-sm font-medium">
        Accept terms and conditions
      </label>
    </div>
  ),
};
export const Disabled: Story = { args: { disabled: true } };
