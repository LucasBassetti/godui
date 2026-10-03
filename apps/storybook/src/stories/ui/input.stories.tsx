import { Button, Input } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  args: { type: "email", placeholder: "Email" },
  decorators: [
    (Story) => (
      <div className="w-80 text-foreground">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/** shadcn's demo. The focus ring snaps (see the docs for why). */
export const Default: Story = {};

export const File: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-3">
      <label htmlFor="picture" className="font-medium text-sm">
        Picture
      </label>
      <Input id="picture" type="file" />
    </div>
  ),
};

export const Disabled: Story = { args: { disabled: true } };

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-3">
      <label htmlFor="email" className="font-medium text-sm">
        Email
      </label>
      <Input {...args} id="email" />
    </div>
  ),
};

export const WithButton: Story = {
  render: (args) => (
    <div className="flex w-full max-w-sm items-center gap-2">
      <Input {...args} />
      <Button type="submit" variant="outline">
        Subscribe
      </Button>
    </div>
  ),
};

/** `aria-invalid`: destructive border; the ring turns destructive on focus. */
export const Invalid: Story = { args: { "aria-invalid": true } };
