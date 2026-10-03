import {
  Button,
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "UI/Popover",
  component: Popover,
  tags: ["autodocs"],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="flex min-h-80 items-start justify-center pt-10">
      <Popover {...args}>
        <PopoverTrigger asChild>
          <Button variant="outline">Open popover</Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <PopoverHeader>
            <PopoverTitle>Dimensions</PopoverTitle>
            <PopoverDescription>
              Set the dimensions for the layer.
            </PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
    </div>
  ),
};

const SIDES = ["top", "right", "bottom", "left"] as const;

export const Sides: Story = {
  render: () => (
    <div className="flex min-h-96 items-center justify-center gap-3">
      {SIDES.map((side) => (
        <Popover key={side}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="capitalize">
              {side}
            </Button>
          </PopoverTrigger>
          <PopoverContent side={side} className="w-48 text-sm">
            Opens to the {side}.
          </PopoverContent>
        </Popover>
      ))}
    </div>
  ),
};
