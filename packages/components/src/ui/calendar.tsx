"use client";

// GodUI Calendar — mirrors shadcn/ui new-york-v4 components/ui/calendar.tsx (registry snapshot 2026-10-01).
// Motion: on Next/Previous the old month drifts a short way out and fades
// (150ms) while the new one drifts in from a quarter width a beat later (20ms
// delay, 260ms spring); the caption drifts less than the grid, so it reads as
// a layer behind it (mirrored in RTL). Dropdown captions don't move: the old
// one hides at once. Picking a day pops a fill layer that carries its own copy
// of the number while it animates; the deselected day's fill shrinks away. A
// range's track sweeps out from the day picked first, cell by cell, in the
// same total time however long it is. Once a range's first day is picked,
// hovering (or focusing) a day previews the range it would make: a lighter
// track sweeps out to a ghost end pill that glides along the row with the
// sweep's front; clicking commits it in place (the tint deepens, the end
// pops, nothing re-sweeps), leaving the grid fades it out. Hover fades an
// overlay; the focus ring fades in on entering the grid and jumps between
// days on keys. Nothing animates on first paint or month navigation.
// GPU-only (transform, opacity).

import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import * as React from "react";
import {
  addToRange,
  type CustomComponents,
  type DateRange,
  type DayButton,
  DayPicker,
  getDefaultClassNames,
  type Matcher,
  rangeContainsModifiers,
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
  // The range preview's hovered day, shared by the days (see CalendarDayButton).
  const [preview] = React.useState(createPreviewStore);
  React.useEffect(() => preview.dispose, [preview]);

  const calendar = (
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
        // to draw, however many days it spans; preview-sweep: the same for
        // a hover preview (and the ghost end's glide), quicker so it keeps
        // up with the pointer; caption-lag: how much later than the weeks
        // the new caption starts (it ends with them); ease-out: the old
        // month's and caption's exit curve.
        "[--godui-calendar-caption-drift:14px] [--godui-calendar-caption-lag:40ms] [--godui-calendar-delay:20ms] [--godui-calendar-ease-out:cubic-bezier(0.25,0.46,0.45,0.94)] [--godui-calendar-dir:1] [--godui-calendar-drift-out:12%] [--godui-calendar-drift:25%] [--godui-calendar-preview-sweep:160ms] [--godui-calendar-sweep:240ms] rtl:[--godui-calendar-dir:-1]",
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

  return (
    <CalendarPreviewContext.Provider value={preview}>
      {calendar}
    </CalendarPreviewContext.Provider>
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

/**
 * A selected range as day indices, `from <= to`; a lone `from` is one day.
 * A hover preview's track also covers its ghost end's outer half (`cap`), so
 * the ghost lies on one tint and its leading edge rides the sweep's front.
 */
type Span = { from: number; to: number; cap?: "from" | "to" } | null;

function spanOf(range: DateRange | undefined): Span {
  const from = range?.from ? dayIndex(range.from) : null;
  const to = range?.to ? dayIndex(range.to) : from;
  return from === null || to === null
    ? null
    : { from: Math.min(from, to), to: Math.max(from, to) };
}

/**
 * The half-cells a range's track covers, in half-day units: day `d`'s start
 * half (toward earlier days) is `2d`, its end half `2d + 1`. The ends' outer
 * halves are the pill's, so a one-day range has no track.
 */
function trackUnits(span: Span): [number, number] | null {
  if (!span || span.from >= span.to) return null;
  return [
    2 * span.from + (span.cap === "from" ? 0 : 1),
    2 * span.to + (span.cap === "to" ? 1 : 0),
  ];
}

function covers(units: [number, number] | null, unit: number) {
  return units !== null && unit >= units[0] && unit <= units[1];
}

/**
 * A track half's slice of its sweep: it starts `at` and lasts `span` (both
 * shares of the sweep's duration) and grows `forward` (toward later days) or
 * back. The halves run back to back, each linear, so the sweep's front is one
 * continuous edge; their slices follow an ease-out cubic, so the front starts
 * fast and settles into the day you picked. A hover preview's sweep is
 * `quick` (--godui-calendar-preview-sweep), and keeps that timing if it's
 * committed mid-sweep.
 */
type Wave = { at: number; span: number; forward: boolean; quick?: boolean };

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
 * sweeps away from the day picked first (`anchor`, for a preview; else the
 * one-day range it grew from). Slices are spread over the new part, so every
 * sweep takes the same total time.
 */
function waveFor(
  unit: number,
  previous: Span,
  next: Span,
  anchor: number | null,
): Wave {
  const [first, last] = trackUnits(next) ?? [unit, unit];
  const drawn = trackUnits(previous);
  if (drawn && drawn[1] >= first && drawn[0] <= last) {
    return unit > drawn[1]
      ? sweep(unit, drawn[1] + 1, last, true)
      : sweep(unit, first, drawn[0] - 1, false);
  }
  const fromEnd =
    anchor !== null
      ? next?.to === anchor
      : previous !== null &&
        next !== null &&
        previous.from === previous.to &&
        previous.from === next.to;
  return sweep(unit, first, last, !fromEnd);
}

// ── Range preview ────────────────────────────────────────────────────────────

/**
 * How long the preview holds after the pointer leaves the grid (for the space
 * between two months, say): long enough to cross to the other month's grid.
 */
const PREVIEW_GRACE_MS = 80;

/** The day a range preview runs to: the hovered or focused day. */
type PreviewTarget = {
  date: Date;
  index: number;
  /** Its week row: the ghost end glides only along a row. */
  row: Element | null;
};

/** The range props that decide what a click would select (React DayPicker's rules). */
type RangeRules = {
  disabled?: Matcher | Matcher[];
  excludeDisabled?: boolean;
  max?: number;
  min?: number;
  required?: boolean;
  resetOnSelect?: boolean;
};

/**
 * The range a click on `target` would make, if a range is pending (its first
 * day picked: a one-day range, or no `to` yet) and the click would extend it
 * — the same rules React DayPicker applies (`min`, `max`, `required`,
 * `excludeDisabled`, `resetOnSelect`). Anything else would start over: no
 * preview. It runs on the default date library: rdp's `dateLib` and
 * `timeZone` aren't on its context, so with a custom date library or a time
 * zone the prediction may disagree with the click in edge cases (a day
 * boundary, a week rule).
 */
function predictSpan(
  target: PreviewTarget | null,
  range: DateRange | undefined,
  rules: RangeRules,
): Span {
  if (!target || !range?.from) return null;
  if (range.to && dayIndex(range.to) !== dayIndex(range.from)) return null;
  if (range.to && rules.resetOnSelect) return null;
  const next = addToRange(
    target.date,
    range,
    rules.min,
    rules.max,
    Boolean(rules.required),
  );
  if (!next?.from || !next.to) return null;
  if (
    rules.excludeDisabled &&
    rules.disabled &&
    rangeContainsModifiers({ from: next.from, to: next.to }, rules.disabled)
  ) {
    return null;
  }
  const span = spanOf(next);
  if (!span || span.from === span.to) return null;
  return { ...span, cap: span.to === target.index ? "to" : "from" };
}

/**
 * The hovered (or focused) day, shared by the days of one Calendar outside
 * React DayPicker's render: entering a day re-renders the days, not the
 * picker, and only on a day change (never per pointer move).
 */
function createPreviewStore() {
  let target: PreviewTarget | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let cache: { key: unknown[]; span: Span } | null = null;
  let unwatch: (() => void) | undefined;
  const listeners = new Set<() => void>();
  const stop = () => {
    clearTimeout(timer);
    unwatch?.();
    unwatch = undefined;
  };
  const set = (next: PreviewTarget | null) => {
    stop();
    if (
      next === target ||
      (next && target && next.index === target.index && next.row === target.row)
    ) {
      return;
    }
    target = next;
    for (const listener of listeners) listener();
  };
  /** Clear, unless a day is entered first. */
  const clearSoon = () => {
    stop();
    timer = setTimeout(() => set(null), PREVIEW_GRACE_MS);
  };
  return {
    get: () => target,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    set,
    clearSoon,
    /**
     * The pointer left `day` for the grid around the days (a row gap, the
     * weekdays): follow it until it enters a day (its mouseenter takes over)
     * or leaves the grid.
     */
    follow(day: Element) {
      stop();
      const doc = day.ownerDocument;
      const over = (event: Event) => {
        const where = whereIs(asElement(event.target), day);
        if (where === "grid") return;
        stop();
        if (where === "disabled") set(null);
        else if (where === "away") clearSoon();
      };
      doc.addEventListener("mouseover", over, true);
      unwatch = () => doc.removeEventListener("mouseover", over, true);
    },
    dispose: stop,
    /** `predictSpan`, worked out once per change for all the days. */
    preview(
      at: PreviewTarget | null,
      range: DateRange | undefined,
      rules: RangeRules,
    ): Span {
      const key = [
        at,
        range,
        rules.min,
        rules.max,
        rules.required,
        rules.resetOnSelect,
        rules.excludeDisabled,
        rules.disabled,
      ];
      if (!cache || key.some((value, i) => value !== cache?.key[i])) {
        cache = { key, span: predictSpan(at, range, rules) };
      }
      return cache.span;
    },
  };
}

type PreviewStore = ReturnType<typeof createPreviewStore>;

const CalendarPreviewContext = React.createContext<PreviewStore | null>(null);

const noTarget = () => null;
const noSubscribe = () => () => {};

/** `target` as an Element, if it is one (from any window: iframes). */
function asElement(target: EventTarget | null): Element | null {
  return target && typeof (target as Element).closest === "function"
    ? (target as Element)
    : null;
}

/** The Calendar an element belongs to (`null` for a custom Root without `data-slot`). */
const calendarOf = (el: Element) => el.closest("[data-slot=calendar]");

/**
 * Where the pointer went, seen from a day of the same calendar: another day
 * (its mouseenter moves the preview), a disabled day (it can't end a range,
 * and its button gets no mouse events), the grid around the days (row gaps,
 * weekdays), or away.
 */
function whereIs(
  to: Element | null,
  from: Element,
): "day" | "disabled" | "grid" | "away" {
  if (!to || calendarOf(to) !== calendarOf(from)) return "away";
  const cell = to.closest("td");
  if (cell?.hasAttribute("data-disabled")) return "disabled";
  if (cell?.hasAttribute("data-day") && to.closest("button")) return "day";
  return to.closest("table, [role=grid]") ? "grid" : "away";
}

// ── Day ──────────────────────────────────────────────────────────────────────

/** One track half's state (see `trackUnits`). */
type Half = {
  on: boolean;
  /**
   * Its last change (in or out) happened while the day was on screen: never
   * on mount.
   */
  animate: boolean;
  /** Its slice of the sweep that drew it. */
  wave: Wave | null;
  /**
   * Whose tint it shows: a hover preview's (lighter) or the range's; kept
   * while it leaves. `none` until first drawn.
   */
  tint: "none" | "preview" | "range";
  /** Committed while drawn: the range's tint fades in over the preview's. */
  commit: boolean;
  /** The preview's cap (its ghost end's outer half): rounded like the pill. */
  cap: boolean;
};

const restingHalf = (on: boolean, preview: boolean, cap: boolean): Half => ({
  on,
  animate: false,
  wave: null,
  tint: !on ? "none" : preview ? "preview" : "range",
  commit: false,
  cap: on && cap,
});

/**
 * The preview's ghost end pill: it `pop`s in when a preview starts, `glide`s
 * in from the previous end along a row (`from`: that end, in days from
 * here), snaps across rows, and `fade`s when the preview ends or commits.
 */
type Ghost = {
  on: boolean;
  animate: "pop" | "glide" | "fade" | null;
  from: number;
};

type DayMotion = {
  filled: boolean;
  span: Span;
  /** The preview's target, while a preview shows. */
  tip: PreviewTarget | null;
  start: Half;
  end: Half;
  ghost: Ghost;
  /**
   * The fill layer animates its last change (in or out) only if that change
   * happened while the day was on screen: never on mount.
   */
  fillAnimate: boolean;
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
  a === b ||
  (a !== null &&
    b !== null &&
    a.from === b.from &&
    a.to === b.to &&
    a.cap === b.cap);

const TRACK_HALF = {
  start: "start-0 end-1/2",
  end: "start-1/2 end-0",
};
// A range-middle cell's track takes the button's corners (rounded at a row's
// edge); an end's inner half is square, like shadcn's accent cell; a
// preview's cap takes the pill's.
const TRACK_CORNERS = {
  start: "rounded-ss-[inherit] rounded-es-[inherit]",
  end: "rounded-se-[inherit] rounded-ee-[inherit]",
};

function CalendarTrackHalf({
  half,
  state,
  middle,
}: {
  half: "start" | "end";
  state: Half;
  middle: boolean;
}) {
  const { on, wave } = state;
  return (
    <span
      aria-hidden="true"
      data-calendar-layer={`track-${half}`}
      data-state={on ? "on" : "off"}
      data-animate={state.animate || undefined}
      data-sweep={wave ? (wave.forward ? "forward" : "backward") : undefined}
      data-tint={state.tint === "none" ? undefined : state.tint}
      data-commit={state.commit || undefined}
      style={
        wave
          ? ({
              "--godui-calendar-track-at": wave.at,
              "--godui-calendar-track-span": wave.span,
              ...(wave.quick && {
                "--godui-calendar-sweep": "var(--godui-calendar-preview-sweep)",
              }),
            } as React.CSSProperties)
          : undefined
      }
      className={cn(
        // The range's accent is the ::after; under it, the span's own tint
        // and hairline edges (the ghost pill's language: outlined is
        // tentative, filled is committed) are what a preview shows. On
        // commit the accent fades in over both. Layout-free, as Chrome traces showed: the ::after is
        // an in-flow block (an `absolute` child of a sweeping half lays out
        // every frame), `isolate` (else its opacity reaching or leaving 1
        // adds or drops a paint layer: a layout), and hidden until a range
        // draws the half, so a moving preview never changes it.
        "pointer-events-none absolute inset-y-0 -z-10 bg-accent/50 shadow-[inset_0_1px_0,inset_0_-1px_0] shadow-primary/20 after:block after:size-full after:rounded-[inherit] after:bg-accent after:opacity-0 after:isolate data-commit:after:transition-[opacity] data-commit:after:duration-(--godui-duration-fast) data-commit:after:ease-out data-[tint=range]:after:opacity-100",
        TRACK_HALF[half],
        (middle || state.cap) && TRACK_CORNERS[half],
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
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onKeyDown,
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
  const isRange = dayPickerProps.mode === "range";
  const range = isRange ? (selected as DateRange | undefined) : undefined;

  // Range preview: the hovered/focused day, if it would end the pending
  // range, draws the range a click would make. Purely visual: rdp's
  // modifiers, aria-selected and your handlers are untouched.
  const context = React.useContext(CalendarPreviewContext);
  const store = isRange ? context : null;
  const target = React.useSyncExternalStore(
    store?.subscribe ?? noSubscribe,
    store?.get ?? noTarget,
    noTarget,
  );
  const preview = store
    ? store.preview(target, range, dayPickerProps as RangeRules)
    : null;
  const tip = preview ? target : null;
  const anchor = preview && range?.from ? dayIndex(range.from) : null;

  const span = preview ?? spanOf(range);
  const date = dayIndex(day.date);
  const units = trackUnits(span);
  const start = covers(units, 2 * date);
  const end = covers(units, 2 * date + 1);
  const previewMiddle =
    preview !== null && date > preview.from && date < preview.to;
  const tipHere = tip !== null && tip.index === date;
  // The tip's outer half: toward later days, or earlier ones for a preview
  // that runs back from the anchor.
  const capHalf = !tipHere ? null : preview?.cap === "from" ? "start" : "end";
  const point = (el: HTMLElement): PreviewTarget | null =>
    modifiers.disabled
      ? null
      : { date: day.date, index: date, row: el.closest("tr") };

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
  // newly covered halves sweep; a preview's ghost end pops, glides or snaps.
  // A preview that's committed is already drawn: the halves only change
  // tint.
  const filled = Boolean(modifiers.selected && !modifiers.range_middle);
  const [motion, setMotion] = React.useState<DayMotion>(() => ({
    filled,
    span,
    tip,
    start: restingHalf(start, preview !== null, capHalf === "start"),
    end: restingHalf(end, preview !== null, capHalf === "end"),
    ghost: { on: tipHere, animate: null, from: 0 },
    fillAnimate: false,
    fillMoving: false,
    hasTrack: isRange || start || end,
  }));
  if (
    motion.filled !== filled ||
    !sameSpan(motion.span, span) ||
    motion.tip !== tip
  ) {
    const previewing = preview !== null;
    const half = (was: Half, on: boolean, unit: number, cap: boolean): Half => {
      if (on !== was.on) {
        return on
          ? {
              on,
              animate: true,
              wave: {
                ...waveFor(unit, motion.span, span, anchor),
                quick: previewing,
              },
              tint: previewing ? "preview" : "range",
              commit: false,
              cap,
            }
          : // Leaving, it keeps its tint and corners.
            { ...was, on, animate: true, wave: null, commit: false };
      }
      if (!on) return was;
      let next = was;
      const tint = previewing ? "preview" : "range";
      if (was.tint !== tint) {
        next = { ...next, tint, commit: was.tint === "preview" };
      }
      if (was.cap !== cap) next = { ...next, cap };
      return next;
    };
    // The ghost glides from the previous end along a row, on the same side
    // of the anchor (never across it: the track starts over there); it
    // snaps across rows.
    const was = motion.tip;
    const ghost: Ghost =
      tipHere === motion.ghost.on
        ? motion.ghost
        : tipHere
          ? was === null
            ? { on: true, animate: "pop", from: 0 }
            : was.row !== null &&
                was.row === tip?.row &&
                anchor !== null &&
                (was.index - anchor) * (date - anchor) > 0
              ? { on: true, animate: "glide", from: was.index - date }
              : { on: true, animate: null, from: 0 }
          : { on: false, animate: tip === null ? "fade" : null, from: 0 };
    setMotion({
      filled,
      span,
      tip,
      start: half(motion.start, start, 2 * date, capHalf === "start"),
      end: half(motion.end, end, 2 * date + 1, capHalf === "end"),
      ghost,
      fillAnimate: filled === motion.filled ? motion.fillAnimate : true,
      fillMoving: filled === motion.filled ? motion.fillMoving : true,
      hasTrack: motion.hasTrack || start || end,
    });
  }

  // If the layer's animation never runs — cancelled by your CSS
  // (`animate-none`), or the day is in a `display: none` subtree —
  // animationend never comes: settle it now rather than keep the copy.
  // Without getAnimations (jsdom, old engines) there's no way to tell, and
  // animationend may never fire either: settle at once too.
  React.useEffect(() => {
    const el = fillRef.current;
    if (!motion.fillMoving || !el) return;
    if (
      typeof el.getAnimations !== "function" ||
      el.getAnimations().length === 0
    ) {
      setMotion((m) => ({ ...m, fillMoving: false }));
    }
  }, [motion.fillMoving]);

  const fillLayer = filled || motion.fillMoving;
  const settled = filled && !motion.fillMoving;
  const middle = Boolean(modifiers.range_middle) || previewMiddle;

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
      data-preview={previewMiddle ? "middle" : tipHere ? "end" : undefined}
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
        // A preview's end shows its ghost instead of the hover overlay; its
        // middle days square off like a range's (rounded at a row's ends).
        "data-[preview=end]:after:opacity-0! data-[preview=middle]:rounded-none [td:last-child>&]:data-[preview=middle]:rounded-r-md",
        dayPickerProps.showWeekNumber
          ? "[td:nth-child(2)>&]:data-[preview=middle]:rounded-l-md"
          : "[td:first-child>&]:data-[preview=middle]:rounded-l-md",
        // Focus ring: a ::before layer (opacity + scale from 98%) instead of
        // shadcn's ring box-shadow (the Button's own one is off); it fades in
        // only when not moved by keys.
        "focus-visible:ring-0 before:pointer-events-none before:absolute before:inset-0 before:scale-[calc(1-0.02*var(--godui-motion))] before:rounded-[inherit] before:opacity-0 before:ring-[3px] before:ring-ring/50 before:transition-none before:duration-(--godui-duration-fast) before:ease-out-expo group-data-[focused=true]/day:before:scale-100 group-data-[focused=true]/day:before:opacity-100 group-data-[focused=true]/day:not-data-[focus-ring=snap]:before:transition-[opacity,scale]",
        defaultClassNames.day,
        className,
      )}
      onMouseEnter={(event) => {
        onMouseEnter?.(event);
        store?.set(point(event.currentTarget));
      }}
      onMouseLeave={(event) => {
        onMouseLeave?.(event);
        // Ends the preview when the pointer leaves the grid (after a short
        // grace: it may be crossing to the other month) or crosses a
        // disabled day; a row gap keeps it.
        if (!store) return;
        const where = whereIs(
          asElement(event.relatedTarget),
          event.currentTarget,
        );
        if (where === "disabled") store.set(null);
        else if (where === "grid") store.follow(event.currentTarget);
        else if (where === "away") store.clearSoon();
      }}
      onFocus={(event) => {
        onFocus?.(event);
        store?.set(point(event.currentTarget));
      }}
      onBlur={(event) => {
        onBlur?.(event);
        // Focus moving to another day (arrow keys) moves the preview there
        // (its focus event); anywhere else ends it.
        const next = asElement(event.relatedTarget);
        if (
          next?.closest("td[data-day]") &&
          calendarOf(next) === calendarOf(event.currentTarget)
        ) {
          return;
        }
        store?.set(null);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.key === "Escape") store?.set(null);
      }}
      {...props}
    >
      {children}
      {motion.hasTrack ? (
        <>
          <CalendarTrackHalf
            half="start"
            state={motion.start}
            middle={middle}
          />
          <CalendarTrackHalf half="end" state={motion.end} middle={middle} />
        </>
      ) : null}
      {store ? (
        // The preview's end: a lighter pill (a tint and a ring), over the
        // track, under a fill. Rendered on every day of a range calendar,
        // so moving the preview changes attributes only, no DOM.
        <span
          aria-hidden="true"
          data-calendar-layer="ghost"
          data-state={motion.ghost.on ? "on" : "off"}
          data-animate={motion.ghost.animate ?? undefined}
          style={
            motion.ghost.animate === "glide"
              ? ({
                  "--godui-calendar-ghost-from": motion.ghost.from,
                } as React.CSSProperties)
              : undefined
          }
          className={cn(
            "pointer-events-none absolute inset-0 -z-10 rounded-[inherit] bg-primary/10 ring-1 ring-primary/35 ring-inset",
            motion.ghost.on
              ? "not-in-[[data-animated-month][aria-hidden=true]]:data-[animate=glide]:animate-godui-calendar-ghost-glide not-in-[[data-animated-month][aria-hidden=true]]:data-[animate=pop]:animate-godui-calendar-fill-in"
              : "opacity-0 not-in-[[data-animated-month][aria-hidden=true]]:data-[animate=fade]:animate-godui-calendar-fade-out",
          )}
        />
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
