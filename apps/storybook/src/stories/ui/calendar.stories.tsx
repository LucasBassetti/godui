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

/**
 * One date. Next/Previous: the old month drifts out, the new one drifts in a
 * beat later; picking a day pops its fill, the old day's fill shrinks away.
 */
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

/**
 * A range across two months. Pick a new end: its fill pops and the track
 * sweeps out to it from the part already drawn, across the month boundary.
 */
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

/**
 * A range with its first day picked (Oct 8). Hover a day, or move the focus
 * with the arrow keys: a lighter track sweeps out to a ghost end that glides
 * along the row; click to commit it in place (the tint deepens, the end
 * pops); leave the grid and it folds back.
 */
export const RangePreview: Story = {
  name: "Range preview",
  render: function Render(args) {
    const [range, setRange] = React.useState<DateRange | undefined>({
      from: new Date(2026, 9, 8),
      to: new Date(2026, 9, 8),
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

/**
 * Month and year dropdowns in the caption. The weeks still drift; the
 * dropdowns don't move or fade, they show the new month at once.
 */
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
 * month change's timing lives in the keyframes and on the root, so it holds.
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

/**
 * A/B of the drift distance, `--godui-calendar-drift` on the root: GodUI's
 * 25% (left) against a full-width page turn (right). Page both.
 */
export const DriftComparison: Story = {
  name: "Drift A/B (25% vs 100%)",
  render: function Render() {
    const [date, setDate] = React.useState<Date | undefined>(
      new Date(2026, 9, 14),
    );
    return (
      <div className="flex flex-wrap items-start justify-center gap-8">
        {(["25", "100"] as const).map((drift) => (
          <div key={drift} data-drift={drift} className="flex flex-col gap-2">
            <span className="text-center text-sm text-muted-foreground">
              {drift}%
            </span>
            <Calendar
              mode="single"
              defaultMonth={OCTOBER}
              selected={date}
              onSelect={setDate}
              className={
                drift === "100"
                  ? "rounded-md border shadow-sm [--godui-calendar-drift-out:100%] [--godui-calendar-drift:100%]"
                  : "rounded-md border shadow-sm"
              }
            />
          </div>
        ))}
      </div>
    );
  },
};

/** Right-to-left: the drift and the range sweep mirror. */
export const Rtl: Story = {
  name: "RTL",
  render: function Render(args) {
    const [range, setRange] = React.useState<DateRange | undefined>({
      from: new Date(2026, 9, 7),
      to: new Date(2026, 9, 16),
    });
    return (
      <Calendar
        {...args}
        dir="rtl"
        mode="range"
        defaultMonth={OCTOBER}
        selected={range}
        onSelect={setRange}
        className="rounded-lg border shadow-sm"
      />
    );
  },
};

/**
 * `fixedWeeks` always shows six weeks, so paging from a five-week month to a
 * six-week one never changes the calendar's height.
 */
export const FixedWeeks: Story = {
  name: "Fixed weeks",
  render: function Render(args) {
    const [date, setDate] = React.useState<Date | undefined>(
      new Date(2026, 9, 14),
    );
    return (
      <Calendar
        {...args}
        mode="single"
        fixedWeeks
        defaultMonth={OCTOBER}
        selected={date}
        onSelect={setDate}
        className="rounded-md border shadow-sm"
      />
    );
  },
};
