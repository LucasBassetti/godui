import { Skeleton } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "UI/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** shadcn's demo: an avatar circle beside two text bars. */
export const Default: Story = {
  render: (args) => (
    <div className="flex items-center space-x-4">
      <Skeleton {...args} className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton {...args} className="h-4 w-[250px]" />
        <Skeleton {...args} className="h-4 w-[200px]" />
      </div>
    </div>
  ),
};

/** shadcn's card example: an image block over two text bars. */
export const Card: Story = {
  render: (args) => (
    <div className="flex flex-col space-y-3">
      <Skeleton {...args} className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton {...args} className="h-4 w-[250px]" />
        <Skeleton {...args} className="h-4 w-[200px]" />
      </div>
    </div>
  ),
};

/** An avatar row with a short and a long bar, as in a list placeholder. */
export const AvatarRow: Story = {
  render: (args) => (
    <div className="flex w-80 items-center gap-4">
      <Skeleton {...args} className="size-10 shrink-0 rounded-full" />
      <div className="grid flex-1 gap-2">
        <Skeleton {...args} className="h-4 w-2/3" />
        <Skeleton {...args} className="h-3 w-full" />
      </div>
    </div>
  ),
};
