"use client";

// GodUI Calendar — mirrors shadcn/ui new-york-v4 components/ui/calendar.tsx (registry snapshot 2026-10-01).
// Motion: on Next/Previous the old month drifts a short way out and fades
// (150ms) while the new one drifts in from a quarter width a beat later (20ms
// delay, 260ms spring); the caption drifts less than the grid, so it reads as
// a layer behind it (mirrored in RTL). Dropdown captions don't move: the old
// one hides at once. Picking a day pops a fill layer that carries its own copy
// of the number while it animates; the deselected day's fill shrinks away. A
// range's track sweeps out from the day picked first, cell by cell, in the
// same total time however long it is. Hover fades an overlay; the focus ring
// fades in on entering the grid and jumps between days on keys. Nothing
// animates on first paint or month navigation. GPU-only (transform, opacity).

import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import * as React from "react";
import {
  type CustomComponents,
  type DateRange,
  type DayButton,
  DayPicker,
  getDefaultClassNames,
  useDayPicker,
} from "react-day-picker";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// react-day-picker toggles these with `classList.add`, which throws on a
// token containing whitespace, so each one is a single class. Its cleanup
// runs on the old caption's animationend: the caption exits last (delay +
// base), after the new weeks have landed. A dropdown caption doesn't move:
// the new one shows at once (`animate-none`) and the old one is hidden for
// the same time, which still ends in an animationend.
function monthMotion(staticCaption: boolean) {
  return {
    weeks_before_enter: "animate-godui-calendar-in-from-start",
    weeks_after_enter: "animate-godui-calendar-in-from-end",
    weeks_before_exit: "animate-godui-calendar-out-to-start",
    weeks_after_exit: "animate-godui-calendar-out-to-end",
    caption_before_enter: staticCaption
      ? "animate-none"
      : "animate-godui-calendar-caption-in-from-start",
    caption_after_enter: staticCaption
      ? "animate-none"
      : "animate-godui-calendar-caption-in-from-end",
    caption_before_exit: staticCaption
      ? "animate-godui-calendar-caption-hide"
      : "animate-godui-calendar-caption-out-to-start",
    caption_after_exit: staticCaption
      ? "animate-godui-calendar-caption-hide"
      : "animate-godui-calendar-caption-out-to-end",
  };
}

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
        // Month-change tuning, read by the godui-calendar-* keyframes. Your
        // className can override any of them, e.g. [--godui-calendar-drift:100%]
        // for a full-width page turn. Every distance and delay is also
        // multiplied by --godui-motion (0 under reduced motion).
        // drift: how far the new weeks travel in (a share of their width);
        // drift-out: how far the old ones leave; caption-drift: the caption's
        // shorter trip (it exits half of it); delay: the new month's beat after
        // the old one starts leaving; sweep: how long a range's track takes
        // to draw, however many days it spans; caption-lag: how much later
        // than the weeks the new caption starts (it ends with them);
        // ease-out: the old month's and caption's exit curve.
        "[--godui-calendar-caption-drift:14px] [--godui-calendar-caption-lag:40ms] [--godui-calendar-delay:20ms] [--godui-calendar-ease-out:cubic-bezier(0.25,0.46,0.45,0.94)] [--godui-calendar-dir:1] [--godui-calendar-drift-out:12%] [--godui-calendar-drift:25%] [--godui-calendar-sweep:240ms] rtl:[--godui-calendar-dir:-1]",
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
        // shadcn paints the accent behind a range's ends on the cell; here it
        // is the day button's track layer, so it can sweep in with the range.
        range_start: cn("rounded-l-md", defaultClassNames.range_start),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("rounded-r-md", defaultClassNames.range_end),
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
        ...monthMotion(captionLayout.startsWith("dropdown")),
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

const DAY_MS = 86_400_000;

/** Whole days since the epoch for a local date (DST can't shift it). */
function dayIndex(date: Date) {
  return Math.round(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS,
  );
}

/** A selected range as day indices, `from <= to`; a lone `from` is one day. */
type Span = { from: number; to: number } | null;

/**
 * The half-cells a range's track covers, in half-day units: day `d`'s start
 * half (toward earlier days) is `2d`, its end half `2d + 1`. The ends' outer
 * halves are the pill's, so a one-day range has no track.
 */
function trackUnits(span: Span): [number, number] | null {
  if (!span || span.from >= span.to) return null;
  return [2 * span.from + 1, 2 * span.to];
}

function covers(units: [number, number] | null, unit: number) {
  return units !== null && unit >= units[0] && unit <= units[1];
}

/**
 * A track half's slice of its sweep: it starts `at` and lasts `span` (both
 * shares of the sweep's duration) and grows `forward` (toward later days) or
 * back. The halves run back to back, each linear, so the sweep's front is one
 * continuous edge; their slices follow an ease-out cubic, so the front starts
 * fast and settles into the day you picked.
 */
type Wave = { at: number; span: number; forward: boolean };

/** When an ease-out-cubic front reaches `x` (a share of the way): its inverse. */
const reachedAt = (x: number) => 1 - (1 - x) ** (1 / 3);

function sweep(
  unit: number,
  first: number,
  last: number,
  forward: boolean,
): Wave {
  const length = last - first + 1;
  const index = forward ? unit - first : last - unit;
  const at = reachedAt(index / length);
  return { at, span: reachedAt((index + 1) / length) - at, forward };
}

/**
 * Where a newly covered half sits in the sweep that draws it. Only the new
 * part of a range sweeps, outward from the part already drawn; a new range
 * sweeps away from the day picked first. Slices are spread over the new
 * part, so every sweep takes the same total time.
 */
function waveFor(unit: number, previous: Span, next: Span): Wave {
  const [first, last] = trackUnits(next) ?? [unit, unit];
  const drawn = trackUnits(previous);
  if (drawn && drawn[1] >= first && drawn[0] <= last) {
    return unit > drawn[1]
      ? sweep(unit, drawn[1] + 1, last, true)
      : sweep(unit, first, drawn[0] - 1, false);
  }
  const fromEnd =
    previous !== null &&
    next !== null &&
    previous.from === previous.to &&
    previous.from === next.to;
  return sweep(unit, first, last, !fromEnd);
}

type DayMotion = {
  filled: boolean;
  span: Span;
  start: boolean;
  end: boolean;
  /**
   * Each layer animates its last change (in or out) only if that change
   * happened while the day was on screen: never on mount.
   */
  fillAnimate: boolean;
  startAnimate: boolean;
  endAnimate: boolean;
  /** Each track half's slice of the sweep that drew it. */
  startWave: Wave | null;
  endWave: Wave | null;
  /**
   * The fill layer is animating (in or out). Only then does it rise above
   * the button's number and carry its own copy; at rest it lies under the
   * number, so a day's text is its number once.
   */
  fillMoving: boolean;
  /** Track halves are rendered from the first time they're needed. */
  hasTrack: boolean;
};

const sameSpan = (a: Span, b: Span) =>
  a === b || (a !== null && b !== null && a.from === b.from && a.to === b.to);

const TRACK_HALF = {
  start: "start-0 end-1/2",
  end: "start-1/2 end-0",
};
// A range-middle cell's track takes the button's corners (rounded at a row's
// edge); an end's inner half is square, like shadcn's accent cell.
const TRACK_CORNERS = {
  start: "rounded-ss-[inherit] rounded-es-[inherit]",
  end: "rounded-se-[inherit] rounded-ee-[inherit]",
};

function CalendarTrackHalf({
  half,
  on,
  animate,
  middle,
  wave,
}: {
  half: "start" | "end";
  on: boolean;
  animate: boolean;
  middle: boolean;
  wave: Wave | null;
}) {
  return (
    <span
      aria-hidden="true"
      data-calendar-layer={`track-${half}`}
      data-state={on ? "on" : "off"}
      data-animate={animate || undefined}
      data-sweep={wave ? (wave.forward ? "forward" : "backward") : undefined}
      style={
        wave
          ? ({
              "--godui-calendar-track-at": wave.at,
              "--godui-calendar-track-span": wave.span,
            } as React.CSSProperties)
          : undefined
      }
      className={cn(
        "pointer-events-none absolute inset-y-0 -z-10 bg-accent",
        TRACK_HALF[half],
        middle && TRACK_CORNERS[half],
        // Each half grows from the side the sweep comes from.
        wave?.forward === false
          ? "origin-right rtl:origin-left"
          : "origin-left rtl:origin-right",
        // Leaving is a keyframe too, not a transition: after an opacity
        // transition Chrome won't composite the next sweep's opacity keyframe
        // on the same element. `not-in-[…]`: the layers' animations stay off
        // inside rdp's exiting clone of the old month, which copies the DOM
        // (data-animate included) as it is.
        on
          ? "not-in-[[data-animated-month][aria-hidden=true]]:data-animate:animate-godui-calendar-track-in"
          : "opacity-0 not-in-[[data-animated-month][aria-hidden=true]]:data-animate:animate-godui-calendar-fade-out",
      )}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  children,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  // The ring fades in only when focus entered this day itself (Tab, a
  // click): the browser focuses it before rdp marks it focused. Anything rdp
  // moves by key snaps: arrow keys (focus still on the previous day, the
  // effect above moves it) and a keyboard month change (the previous day
  // was unmounted with its month, focus is on <body>).
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!modifiers.focused || !el) return;
    el.dataset.focusRing =
      el.ownerDocument.activeElement === el ? "fade" : "snap";
  }, [modifiers.focused]);

  const { selected, dayPickerProps } = useDayPicker();
  const range =
    dayPickerProps.mode === "range"
      ? (selected as DateRange | undefined)
      : undefined;
  const from = range?.from ? dayIndex(range.from) : null;
  const to = range?.to ? dayIndex(range.to) : from;
  const span: Span =
    from === null || to === null
      ? null
      : { from: Math.min(from, to), to: Math.max(from, to) };
  const date = dayIndex(day.date);
  const units = trackUnits(span);
  const start = covers(units, 2 * date);
  const end = covers(units, 2 * date + 1);

  const fillRef = React.useRef<HTMLSpanElement>(null);
  const settleFill = (event: React.AnimationEvent<HTMLSpanElement>) => {
    // The layer's own animation (not its ::before's, not a child's) ending
    // as the one its current state plays: it comes to rest (or goes).
    if (event.target !== event.currentTarget || event.pseudoElement) return;
    const name = event.animationName;
    setMotion((m) =>
      name === (m.filled ? "godui-calendar-fill-in" : "godui-calendar-fade-out")
        ? { ...m, fillMoving: false }
        : m,
    );
  };

  // Animate only changes that happen while this day is on screen — not first
  // paint, and not month navigation (rdp remounts every day of a newly shown
  // month). The filled day (a single date or a range end) pops; a range's
  // newly covered halves sweep.
  const filled = Boolean(modifiers.selected && !modifiers.range_middle);
  const [motion, setMotion] = React.useState<DayMotion>(() => ({
    filled,
    span,
    start,
    end,
    fillAnimate: false,
    startAnimate: false,
    endAnimate: false,
    startWave: null,
    endWave: null,
    fillMoving: false,
    hasTrack: start || end,
  }));
  if (motion.filled !== filled || !sameSpan(motion.span, span)) {
    setMotion({
      filled,
      span,
      start,
      end,
      fillAnimate: filled === motion.filled ? motion.fillAnimate : true,
      startAnimate: start === motion.start ? motion.startAnimate : true,
      endAnimate: end === motion.end ? motion.endAnimate : true,
      startWave: !start
        ? null
        : motion.start
          ? motion.startWave
          : waveFor(2 * date, motion.span, span),
      endWave: !end
        ? null
        : motion.end
          ? motion.endWave
          : waveFor(2 * date + 1, motion.span, span),
      fillMoving: filled === motion.filled ? motion.fillMoving : true,
      hasTrack: motion.hasTrack || start || end,
    });
  }

  // If the layer's animation never runs — cancelled by your CSS
  // (`animate-none`), or the day is in a `display: none` subtree —
  // animationend never comes: settle it now rather than keep the copy.
  React.useEffect(() => {
    const el = fillRef.current;
    if (!motion.fillMoving || !el || typeof el.getAnimations !== "function") {
      return;
    }
    if (el.getAnimations().length === 0) {
      setMotion((m) => ({ ...m, fillMoving: false }));
    }
  }, [motion.fillMoving]);

  const fillLayer = filled || motion.fillMoving;
  const settled = filled && !motion.fillMoving;

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
      data-fill={filled ? (settled ? "settled" : "moving") : undefined}
      className={cn(
        // shadcn's fills (bg-primary on a selected day or range end, bg-accent
        // on the range middle) and its box-shadow focus ring move to layers;
        // the steady state is the same. While the fill layer pops in or
        // shrinks away it covers the number with its own copy and the button
        // keeps the unselected colour; at rest the fill lies under the
        // button's own number, now primary-foreground.
        "relative isolate flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:z-10 data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-middle=true]:rounded-none data-[range-middle=true]:text-accent-foreground data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md dark:hover:text-accent-foreground [&>span:not([data-calendar-layer])]:text-xs [&>span:not([data-calendar-layer])]:opacity-70",
        // Hover: the ghost button's accent moves to an overlay that fades. A
        // settled fill keeps its colours under the pointer (in both themes):
        // the overlay would paint over it.
        settled &&
          "text-primary-foreground after:hidden hover:text-primary-foreground dark:hover:text-primary-foreground",
        "hover:bg-transparent dark:hover:bg-transparent after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-[inherit] after:bg-accent after:opacity-0 after:transition-[opacity] after:duration-100 after:ease-out hover:after:opacity-100 dark:after:bg-accent/50",
        // Focus ring: a ::before layer (opacity + scale from 98%) instead of
        // shadcn's ring box-shadow (the Button's own one is off); it fades in
        // only when not moved by keys.
        "focus-visible:ring-0 before:pointer-events-none before:absolute before:inset-0 before:scale-[calc(1-0.02*var(--godui-motion))] before:rounded-[inherit] before:opacity-0 before:ring-[3px] before:ring-ring/50 before:transition-none before:duration-(--godui-duration-fast) before:ease-out-expo group-data-[focused=true]/day:before:scale-100 group-data-[focused=true]/day:before:opacity-100 group-data-[focused=true]/day:not-data-[focus-ring=snap]:before:transition-[opacity,scale]",
        defaultClassNames.day,
        className,
      )}
      {...props}
    >
      {children}
      {motion.hasTrack ? (
        <>
          <CalendarTrackHalf
            half="start"
            on={start}
            animate={motion.startAnimate}
            middle={Boolean(modifiers.range_middle)}
            wave={motion.startWave}
          />
          <CalendarTrackHalf
            half="end"
            on={end}
            animate={motion.endAnimate}
            middle={Boolean(modifiers.range_middle)}
            wave={motion.endWave}
          />
        </>
      ) : null}
      {fillLayer ? (
        // The fill (its ::before) above the range track. While it animates,
        // it also rises above the number with a copy of it in its colour, so
        // the number never shows white on a fill that hasn't arrived yet; at
        // rest it drops under the button's own number (z -10, after the
        // track halves) and the copy goes. It leaves after its fade-out.
        <span
          ref={fillRef}
          aria-hidden="true"
          data-calendar-layer="fill"
          data-state={filled ? "on" : "off"}
          data-animate={motion.fillAnimate || undefined}
          onAnimationEnd={settleFill}
          className={cn(
            "pointer-events-none absolute inset-0 isolate flex flex-col items-center justify-center gap-1 rounded-[inherit] text-primary-foreground before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-primary [&>span]:text-xs [&>span]:opacity-70",
            settled && "-z-10",
            // Popping in, the fill and its number grow together. Leaving,
            // only the fill shrinks: the number fades where it is, over the
            // real one, so the two never show out of register. `not-in-[…]`:
            // off inside rdp's exiting clone of the old month (it copies the
            // DOM as it is), where the layer then shows its resting state.
            filled
              ? "not-in-[[data-animated-month][aria-hidden=true]]:data-animate:animate-godui-calendar-fill-in"
              : "opacity-0 not-in-[[data-animated-month][aria-hidden=true]]:data-animate:animate-godui-calendar-fade-out not-in-[[data-animated-month][aria-hidden=true]]:data-animate:before:animate-godui-calendar-fill-shrink",
          )}
        >
          {motion.fillMoving ? children : null}
        </span>
      ) : null}
    </Button>
  );
}

export { Calendar, CalendarDayButton };
