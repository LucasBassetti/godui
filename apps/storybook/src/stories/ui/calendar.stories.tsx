import { Calendar } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

/** react-day-picker's `DateRange` (the package isn't a Storybook dependency). */
type DateRange = { from: Date | undefined; to?: Date | undefined };

const meta = {
  title: "UI/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Fixed months so traces and screenshots are stable.
const OCTOBER = new Date(2026, 9, 1);

/** One date. Next/Previous slide the month; picking a day pops it. */
export const Single: Story = {
  render: function Render(args) {
    const [date, setDate] = React.useState<Date | undefined>(
      new Date(2026, 9, 14),
    );
    return (
      <Calendar
        {...args}
        mode="single"
        defaultMonth={OCTOBER}
        selected={date}
        onSelect={setDate}
        className="rounded-md border shadow-sm"
      />
    );
  },
};

/** A range across two months; both months slide together. */
export const RangeTwoMonths: Story = {
  name: "Range (two months)",
  render: function Render(args) {
    const [range, setRange] = React.useState<DateRange | undefined>({
      from: new Date(2026, 9, 12),
      to: new Date(2026, 10, 3),
    });
    return (
      <Calendar
        {...args}
        mode="range"
        defaultMonth={OCTOBER}
        selected={range}
        onSelect={setRange}
        numberOfMonths={2}
        className="rounded-lg border shadow-sm"
      />
    );
  },
};

/** Month and year dropdowns in the caption; the nav buttons still slide. */
export const DropdownCaption: Story = {
  name: "Dropdown caption",
  render: function Render(args) {
    const [date, setDate] = React.useState<Date | undefined>(
      new Date(2026, 9, 14),
    );
    return (
      <Calendar
        {...args}
        mode="single"
        defaultMonth={OCTOBER}
        selected={date}
        onSelect={setDate}
        captionLayout="dropdown"
        className="rounded-md border shadow-sm"
      />
    );
  },
};

/**
 * Your own `classNames.weeks` / `month_caption` replace GodUI's strings; the
 * slide's timing lives on the root, so the month still slides as one strip.
 */
export const CustomClassNames: Story = {
  name: "Custom classNames",
  render: function Render(args) {
    const [date, setDate] = React.useState<Date | undefined>(
      new Date(2026, 9, 14),
    );
    return (
      <Calendar
        {...args}
        mode="single"
        defaultMonth={OCTOBER}
        selected={date}
        onSelect={setDate}
        className="rounded-md border shadow-sm"
        classNames={{
          weeks: "text-foreground",
          month_caption: "flex h-(--cell-size) items-center justify-center",
        }}
      />
    );
  },
};
