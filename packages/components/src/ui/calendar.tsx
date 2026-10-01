"use client";

// GodUI Calendar — mirrors shadcn/ui new-york-v4 components/ui/calendar.tsx (registry snapshot 2026-10-01).
// Motion: on Next/Previous the new month's weeks slide in a full width while
// react-day-picker's clone of the old month slides out the other way, on the
// same curve and clock, so the two move as one strip (mirrored in RTL); the
// caption cross-fades. A newly selected day pops — only
// after a change, never on first paint or month navigation. The range middle
// and every fill snap. GPU-only.

import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import * as React from "react";
import {
  type CustomComponents,
  type DayButton,
  DayPicker,
  getDefaultClassNames,
} from "react-day-picker";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// react-day-picker toggles these with `classList.add`, which throws on a
// token containing whitespace, so each one is a single class. The slide
// distance (a whole month, negated in RTL) lives on the weeks element and
// the caption exit's duration on the caption.
const monthMotion = {
  weeks_before_enter: "animate-godui-slide-in-from-left",
  weeks_after_enter: "animate-godui-slide-in-from-right",
  weeks_before_exit: "animate-godui-slide-out-to-left",
  weeks_after_exit: "animate-godui-slide-out-to-right",
  caption_before_enter: "animate-godui-fade-in",
  caption_after_enter: "animate-godui-fade-in",
  caption_before_exit: "animate-godui-fade-out",
  caption_after_exit: "animate-godui-fade-out",
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  animate = true,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      animate={animate}
      className={cn(
        "group/calendar bg-background p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        // Month-slide timing, scoped to the elements rdp animates (it marks
        // them with data-animated-* while `animate` is on). Kept on the root,
        // which composes with your className, rather than in classNames, which
        // your own `weeks` / `month_caption` would replace wholesale.
        //
        // rdp removes the old month, and strips the new weeks' enter class,
        // on the old *caption's* animationend, so its fade-out lasts as long
        // as the weeks slide (base), not the token's fast.
        "**:data-animated-caption:[--godui-duration-fast:var(--godui-duration-base)]",
        // A slide travels the full width; RTL mirrors it. The old and new
        // weeks share one duration and one curve (the enter's spring), so they
        // move as a single strip: no gap opens between the months, and the
        // whole change ends in one frame. These redefine shared tokens, so
        // everything inside the weeks (the day buttons) inherits them too.
        "**:data-animated-weeks:[--ease-out-expo:var(--ease-spring-smooth)] **:data-animated-weeks:[--godui-duration-slow:var(--godui-duration-base)] **:data-animated-weeks:[--godui-enter-distance:100%] rtl:**:data-animated-weeks:[--godui-enter-distance:-100%]",
        className,
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months,
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns,
        ),
        dropdown_root: cn(
          "relative rounded-md border border-input shadow-xs has-focus:border-ring has-focus:ring-[3px] has-focus:ring-ring/50",
          defaultClassNames.dropdown_root,
        ),
        dropdown: cn(
          "absolute inset-0 bg-popover opacity-0",
          defaultClassNames.dropdown,
        ),
        caption_label: cn(
          "font-medium select-none",
          captionLayout === "label"
            ? "text-sm"
            : "flex h-8 items-center gap-1 rounded-md pr-1 pl-2 text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground",
          defaultClassNames.caption_label,
        ),
        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 rounded-md text-[0.8rem] font-normal text-muted-foreground select-none",
          defaultClassNames.weekday,
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-(--cell-size) select-none",
          defaultClassNames.week_number_header,
        ),
        week_number: cn(
          "text-[0.8rem] text-muted-foreground select-none",
          defaultClassNames.week_number,
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full p-0 text-center select-none [&:last-child[data-selected=true]_button]:rounded-r-md",
          props.showWeekNumber
            ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-md"
            : "[&:first-child[data-selected=true]_button]:rounded-l-md",
          defaultClassNames.day,
        ),
        range_start: cn(
          "rounded-l-md bg-accent",
          defaultClassNames.range_start,
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("rounded-r-md bg-accent", defaultClassNames.range_end),
        today: cn(
          "rounded-md bg-accent text-accent-foreground data-[selected=true]:rounded-none",
          defaultClassNames.today,
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside,
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled,
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...monthMotion,
        ...classNames,
      }}
      components={{
        Root: CalendarRoot,
        Chevron: CalendarChevron,
        DayButton: CalendarDayButton,
        WeekNumber: CalendarWeekNumber,
        ...components,
      }}
      {...props}
    />
  );
}

// shadcn declares these inline, which hands rdp a new component type on every
// Calendar render and remounts the whole grid. Hoisted (same markup) so a
// day's state survives a controlled selection — the pop depends on it.
function CalendarRoot({
  className,
  rootRef,
  ...props
}: React.ComponentProps<NonNullable<CustomComponents["Root"]>>) {
  return (
    <div
      data-slot="calendar"
      ref={rootRef}
      className={cn(className)}
      {...props}
    />
  );
}

function CalendarChevron({
  className,
  orientation,
  ...props
}: React.ComponentProps<NonNullable<CustomComponents["Chevron"]>>) {
  if (orientation === "left") {
    return <ChevronLeftIcon className={cn("size-4", className)} {...props} />;
  }

  if (orientation === "right") {
    return <ChevronRightIcon className={cn("size-4", className)} {...props} />;
  }

  return <ChevronDownIcon className={cn("size-4", className)} {...props} />;
}

function CalendarWeekNumber({
  children,
  ...props
}: React.ComponentProps<NonNullable<CustomComponents["WeekNumber"]>>) {
  return (
    <td {...props}>
      <div className="flex size-(--cell-size) items-center justify-center text-center">
        {children}
      </div>
    </td>
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  // Pop only when this day becomes a selected single day or range end — not
  // on first paint, and not on month navigation (rdp remounts every day of
  // a newly shown month). The range middle fills without a pop.
  const filled = Boolean(modifiers.selected && !modifiers.range_middle);
  const [lastFilled, setLastFilled] = React.useState(filled);
  const [animate, setAnimate] = React.useState(false);
  if (filled !== lastFilled) {
    setLastFilled(filled);
    setAnimate(filled);
  }

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      data-animate={animate || undefined}
      className={cn(
        "flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-ring/50 data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground dark:hover:text-accent-foreground [&>span]:text-xs [&>span]:opacity-70",
        // The pop is the press feedback: the Button's own press scale would
        // run a second `scale` animation on the same element and Chrome
        // stops compositing both. rdp's sliding-out clone of the old month
        // copies data-animate; the clone must not replay the pop.
        "active:scale-none [--godui-pop-scale:0.88] not-in-[[data-animated-month][aria-hidden=true]]:data-[animate=true]:animate-godui-pop",
        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
