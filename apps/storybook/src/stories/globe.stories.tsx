import { Globe } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Effects/Globe",
  component: Globe,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Globe>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex h-[440px] w-[440px] items-center justify-center">
      <Globe />
    </div>
  ),
};
