import { Button, Textarea } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  args: { placeholder: "Type your message here." },
  decorators: [
    (Story) => (
      <div className="w-80 text-foreground">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

/** shadcn's demo. The focus ring snaps (see the docs for why). */
export const Default: Story = {};

export const WithButton: Story = {
  render: (args) => (
    <div className="grid w-full gap-2">
      <Textarea {...args} />
      <Button>Send message</Button>
    </div>
  ),
};

export const Disabled: Story = { args: { disabled: true } };

/** `aria-invalid`: destructive border; the ring turns destructive on focus. */
export const Invalid: Story = { args: { "aria-invalid": true } };
