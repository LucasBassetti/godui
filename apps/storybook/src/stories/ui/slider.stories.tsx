import { Button, Slider } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

const meta = {
  title: "UI/Slider",
  component: Slider,
  tags: ["autodocs"],
  args: { defaultValue: [50], max: 100, step: 1, className: "w-80" },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Range: Story = { args: { defaultValue: [25, 75] } };
export const Vertical: Story = {
  args: { orientation: "vertical", className: "h-44" },
};
/** Coarse steps glide from step to step, even mid-drag. */
export const Steps: Story = { args: { defaultValue: [50], step: 25 } };
export const Inverted: Story = { args: { defaultValue: [30], inverted: true } };
export const RightToLeft: Story = { args: { defaultValue: [30], dir: "rtl" } };

/** A new `value` from outside glides there on the click's spring. */
export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState([20, 60]);
    return (
      <div className="flex flex-col items-center gap-8">
        <Slider
          {...args}
          defaultValue={undefined}
          value={value}
          onValueChange={setValue}
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setValue([10, 35])}
          >
            Low
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setValue([40, 90])}
          >
            High
          </Button>
        </div>
      </div>
    );
  },
};
