"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Calendar,
  CalendarDayButton,
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Checkbox,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  Progress,
  RadioGroup,
  RadioGroupItem,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  Skeleton,
  Slider,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
} from "@godui/components";
import {
  Bold,
  BookOpenIcon,
  BotIcon,
  Circle,
  FrameIcon,
  GalleryVerticalEndIcon,
  MousePointer2Icon,
  SearchIcon,
  SquareTerminalIcon,
} from "lucide-react";
import {
  type ComponentProps,
  type CSSProperties,
  Fragment,
  type HTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import { ScrollScene } from "../scroll-scene";

const STEP_MS = 1200;

/**
 * Skeleton label — scenes show the real components, but with placeholder bars
 * instead of words, like every other Learn scene.
 */
function Bar({ className }: { className: string }) {
  return <span className={`block h-2 rounded-full ${className}`} />;
}

function useToggle(reduced: boolean) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setOn((v) => !v), STEP_MS);
    return () => clearInterval(id);
  }, [reduced]);
  return on;
}

/** Real Button; a forced `scale-[0.97]` stands in for `:active`. */
function ButtonPress({ reduced }: { reduced: boolean }) {
  const pressed = useToggle(reduced);
  return (
    <Button size="lg" className={pressed ? "scale-[0.97]" : undefined}>
      <Bar className="w-16 bg-primary-foreground/60" />
    </Button>
  );
}

/** Real Switch; `checked` toggles on the timer. */
function SwitchToggle({ reduced }: { reduced: boolean }) {
  const on = useToggle(reduced);
  return (
    <div className="flex items-center gap-6">
      <Switch checked={on} aria-label="Demo switch" className="scale-150" />
      <Switch checked={!on} aria-label="Demo switch, inverted" />
    </div>
  );
}

/** Real Checkbox; toggles on the timer, with a forced press while checking. */
function CheckboxToggle({ reduced }: { reduced: boolean }) {
  const on = useToggle(reduced);
  return (
    <div className="flex items-center gap-6">
      <Checkbox checked={on} aria-label="Demo checkbox" className="scale-[2]" />
      <Checkbox checked={!on} aria-label="Demo checkbox, inverted" />
    </div>
  );
}

/** Real Toggle; `pressed` flips on the timer. */
function TogglePress({ reduced }: { reduced: boolean }) {
  const on = useToggle(reduced);
  return (
    <Toggle
      pressed={on}
      variant="outline"
      size="lg"
      aria-label="Bold"
      className="px-5 font-bold"
    >
      <Bold />
    </Toggle>
  );
}

const COMMANDS = ["Calendar", "Search Emoji", "Calculator", "Settings"];
const BAR_WIDTHS = ["w-24", "w-32", "w-20", "w-28"];

/** Real Command; cmdk's controlled `value` moves the selection on the timer. */
function CommandCycle({ reduced }: { reduced: boolean }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % COMMANDS.length),
      STEP_MS,
    );
    return () => clearInterval(id);
  }, [reduced]);
  return (
    <Command
      value={COMMANDS[index]}
      className="w-72 rounded-lg border shadow-md"
    >
      <CommandList>
        <CommandGroup>
          {COMMANDS.map((item, i) => (
            <CommandItem key={item} value={item}>
              <Circle />
              <Bar
                className={`${BAR_WIDTHS[i % BAR_WIDTHS.length]} bg-foreground/25`}
              />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

const RANGES = ["Day", "Week", "Month", "Year"];

/** Real single-select ToggleGroup; the value cycles, so the indicator slides. */
function ToggleGroupCycle({ reduced }: { reduced: boolean }) {
  const [index, setIndex] = useState(1);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % RANGES.length),
      STEP_MS,
    );
    return () => clearInterval(id);
  }, [reduced]);
  return (
    <ToggleGroup type="single" variant="outline" value={RANGES[index]}>
      {RANGES.map((range) => (
        <ToggleGroupItem key={range} value={range} aria-label={range}>
          <Bar className="w-6 bg-foreground/30" />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

const RADIOS = ["Default", "Comfortable", "Compact"];

/** Real RadioGroup; the value cycles, so each dot grows in as it's selected. */
function RadioCycle({ reduced }: { reduced: boolean }) {
  const [index, setIndex] = useState(1);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % RADIOS.length),
      STEP_MS,
    );
    return () => clearInterval(id);
  }, [reduced]);
  return (
    <RadioGroup value={RADIOS[index]} className="gap-4">
      {RADIOS.map((label, i) => (
        <div key={label} className="flex items-center gap-3">
          <RadioGroupItem
            value={label}
            aria-label={label}
            className="scale-150"
          />
          <Bar
            className={`${BAR_WIDTHS[i % BAR_WIDTHS.length]} bg-foreground/25`}
          />
        </div>
      ))}
    </RadioGroup>
  );
}

const TABS = ["Account", "Password", "Notifications"];

/** Real Tabs; the controlled value cycles, so the indicator FLIPs on its own. */
function TabsCycle({ reduced }: { reduced: boolean }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % TABS.length),
      STEP_MS,
    );
    return () => clearInterval(id);
  }, [reduced]);
  return (
    <Tabs value={TABS[index]} className="w-80">
      <TabsList>
        {TABS.map((tab) => (
          <TabsTrigger key={tab} value={tab} aria-label={tab} className="px-4">
            <Bar className="w-10 bg-foreground/30" />
          </TabsTrigger>
        ))}
      </TabsList>
      {TABS.map((tab) => (
        <TabsContent
          key={tab}
          value={tab}
          className="rounded-lg border p-4 text-sm"
        >
          <div className="flex flex-col gap-2">
            <Bar className="w-40 bg-foreground/20" />
            <Bar className="w-28 bg-foreground/15" />
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}

const PROGRESS_STEPS = [13, 40, 66, 100];

/** Real Progress; the value steps on the timer, so the fill glides. */
function ProgressStep({ reduced }: { reduced: boolean }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % PROGRESS_STEPS.length),
      STEP_MS,
    );
    return () => clearInterval(id);
  }, [reduced]);
  return (
    <div className="grid w-72 gap-3">
      <div className="flex items-center justify-between">
        <Bar className="w-24 bg-foreground/30" />
        <Bar className="w-8 bg-foreground/20" />
      </div>
      <Progress
        value={PROGRESS_STEPS[reduced ? 2 : index]}
        aria-label="Demo progress"
        className="h-3"
      />
    </div>
  );
}

/** Real Progress with no value: the indeterminate sweep loops on its own. */
function ProgressIndeterminate() {
  return (
    <div className="grid w-72 gap-3">
      <Bar className="w-24 bg-foreground/30" />
      <Progress aria-label="Demo loading" className="h-3" />
    </div>
  );
}

/** A skeleton row (avatar + two bars) as skeleton bars; `className` reaches every block. */
function SkeletonRow({ className }: { className?: string }) {
  return (
    <div className="flex w-72 items-center gap-4">
      <Skeleton
        className={`size-12 shrink-0 rounded-full ${className ?? ""}`}
      />
      <div className="grid flex-1 gap-2.5">
        <Skeleton className={`h-4 w-full ${className ?? ""}`} />
        <Skeleton className={`h-4 w-2/3 ${className ?? ""}`} />
      </div>
    </div>
  );
}

/** Real Skeleton with the band slowed to 3s so the sweep is easy to follow. */
function SkeletonShimmer() {
  return <SkeletonRow className="after:[animation-duration:3s]" />;
}

/** The reduced-motion fallback: no band, shadcn's opacity pulse. */
function SkeletonPulse() {
  return <SkeletonRow className="animate-pulse after:hidden" />;
}

const MENUS = [
  { value: "file", trigger: "w-6", items: ["w-24", "w-20", "w-28"] },
  { value: "edit", trigger: "w-7", items: ["w-16", "w-24", "w-20", "w-14"] },
  { value: "view", trigger: "w-8", items: ["w-28", "w-20"] },
];

/**
 * Real Menubar; the controlled `value` hops right on the timer, so one menu
 * exits while the next enters. Auto-focus is off so the scene never steals
 * focus from the page. The menus portal to <body>, so they only open while
 * the bar itself is laid out: the Learn player also mounts a hidden copy of
 * every scene, whose menus would otherwise float at the page's top-left.
 */
function MenubarHop({ reduced }: { reduced: boolean }) {
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const observer = new ResizeObserver(([entry]) =>
      setShown(entry.contentRect.width > 0),
    );
    observer.observe(bar);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % MENUS.length),
      STEP_MS,
    );
    return () => clearInterval(id);
  }, [reduced]);
  const noFocus = (event: Event) => event.preventDefault();
  return (
    <div ref={barRef} className="flex h-48 items-start pt-4">
      <Menubar value={shown ? MENUS[index].value : ""}>
        {MENUS.map((menu) => (
          <MenubarMenu key={menu.value} value={menu.value}>
            <MenubarTrigger aria-label={menu.value} className="h-7 px-3">
              <Bar className={`${menu.trigger} bg-foreground/40`} />
            </MenubarTrigger>
            <MenubarContent
              // @ts-expect-error Radix omits onOpenAutoFocus from MenubarContent's type, but it reaches the menu's focus scope at runtime (keeps hops from stealing page focus).
              onOpenAutoFocus={noFocus}
              onCloseAutoFocus={noFocus}
            >
              {menu.items.map((w, i) => (
                <Fragment key={w}>
                  {i === menu.items.length - 1 && <MenubarSeparator />}
                  <MenubarItem className="h-8">
                    <Bar className={`${w} bg-foreground/25`} />
                  </MenubarItem>
                </Fragment>
              ))}
            </MenubarContent>
          </MenubarMenu>
        ))}
      </Menubar>
    </div>
  );
}

const NAV_ITEMS = [
  {
    value: "one",
    trigger: "w-8",
    panel: "w-64",
    rows: ["w-40", "w-28", "w-48"],
  },
  { value: "two", trigger: "w-12", panel: "w-80", rows: ["w-56", "w-40"] },
  {
    value: "three",
    trigger: "w-6",
    panel: "w-56",
    rows: ["w-32", "w-44", "w-24", "w-36"],
  },
];
/** Out to the right and back, so both slide directions play. */
const NAV_ORDER = [0, 1, 2, 1];

/**
 * Real NavigationMenu; the controlled `value` walks right and back, so each
 * switch slides the old content out toward the new trigger and the new one in
 * from the other side. Panels differ in size, so the viewport snaps.
 * `outlined` dashes the viewport's box, so the snap is visible on its own.
 */
function NavigationMenuHop({
  reduced,
  outlined = false,
}: {
  reduced: boolean;
  outlined?: boolean;
}) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(
      () => setStep((i) => (i + 1) % NAV_ORDER.length),
      STEP_MS,
    );
    return () => clearInterval(id);
  }, [reduced]);
  return (
    <div className="flex h-60 items-start pt-2">
      <NavigationMenu
        value={NAV_ITEMS[NAV_ORDER[step]].value}
        className={
          outlined
            ? "**:data-[slot=navigation-menu-viewport]:outline-1 **:data-[slot=navigation-menu-viewport]:-outline-offset-1 **:data-[slot=navigation-menu-viewport]:outline-dashed **:data-[slot=navigation-menu-viewport]:outline-[var(--foreground)]/50"
            : undefined
        }
      >
        <NavigationMenuList>
          {NAV_ITEMS.map((item) => (
            <NavigationMenuItem key={item.value} value={item.value}>
              <NavigationMenuTrigger aria-label={item.value}>
                <Bar className={`${item.trigger} bg-foreground/40`} />
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className={`grid gap-3 p-2 ${item.panel}`}>
                  {item.rows.map((w) => (
                    <div key={w} className="grid gap-1.5">
                      <Bar className={`${w} bg-foreground/35`} />
                      <Bar className="w-full bg-foreground/15" />
                    </div>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

function NavigationMenuSnap({ reduced }: { reduced: boolean }) {
  return <NavigationMenuHop reduced={reduced} outlined />;
}

const CAROUSEL_SLIDES = [
  { id: "a", lines: ["w-24", "w-16"] },
  { id: "b", lines: ["w-20", "w-28"] },
  { id: "c", lines: ["w-28", "w-12"] },
  { id: "d", lines: ["w-16", "w-24"] },
];

/**
 * Real Carousel of bar-only slides; `scrollNext` fires on the timer (back to
 * the first slide at the end). `jump` is Embla's argument: the same call lands
 * on the slide without the scroll, as it does under reduced motion.
 */
function CarouselAdvance({
  reduced,
  jump,
}: {
  reduced: boolean;
  jump: boolean;
}) {
  const [api, setApi] = useState<CarouselApi>();
  useEffect(() => {
    if (!api || (reduced && !jump)) return;
    const id = setInterval(() => {
      if (api.canScrollNext()) api.scrollNext(jump);
      else api.scrollTo(0, jump);
    }, STEP_MS + 400);
    return () => clearInterval(id);
  }, [api, reduced, jump]);
  return (
    <div className="w-full max-w-sm px-12">
      <Carousel setApi={setApi} className="mx-auto w-full max-w-[13rem]">
        <CarouselContent>
          {CAROUSEL_SLIDES.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="flex aspect-[4/3] flex-col justify-end gap-2.5 rounded-xl border bg-card p-4">
                <div className="mb-auto size-8 rounded-full bg-foreground/15" />
                {slide.lines.map((w, i) => (
                  <Bar
                    key={w}
                    className={`${w} ${i === 0 ? "bg-foreground/35" : "bg-foreground/20"}`}
                  />
                ))}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

function CarouselGlide({ reduced }: { reduced: boolean }) {
  return <CarouselAdvance reduced={reduced} jump={false} />;
}

function CarouselJump({ reduced }: { reduced: boolean }) {
  return <CarouselAdvance reduced={reduced} jump />;
}

/** Day cells as dots: the real day button, with a dot instead of the number. */
function CalendarDotDay(props: ComponentProps<typeof CalendarDayButton>) {
  return (
    <CalendarDayButton {...props}>
      <span className="size-2 rounded-full bg-current" />
    </CalendarDayButton>
  );
}

/** Weekday header as a short bar. */
function CalendarBarWeekday(props: HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th {...props}>
      <Bar className="mx-auto w-3 bg-foreground/25" />
    </th>
  );
}

const CALENDAR_CAPTION_WIDTHS = ["w-20", "w-14", "w-24", "w-16"];

/**
 * Caption as a bar. `formatCaption` hands over the month index instead of a
 * name, so each month's bar has its own width and the cross-fade shows.
 */
function CalendarBarCaption({
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  const width = CALENDAR_CAPTION_WIDTHS[Number(children) % 4];
  return (
    <span {...props}>
      <Bar className={`${width} bg-foreground/45`} />
    </span>
  );
}

const CALENDAR_PARTS = {
  CaptionLabel: CalendarBarCaption,
  DayButton: CalendarDotDay,
  Weekday: CalendarBarWeekday,
};
const CALENDAR_FORMATTERS = {
  formatCaption: (month: Date) => String(month.getMonth()),
};
const CALENDAR_SLIDE_MS = 800;

/**
 * Real Calendar, wordless, on a ~3x slowed clock (every duration and the
 * enter's delay, so the overlap keeps its shape): the controlled `month`
 * alternates Next and Previous, so the months drift both ways. `outlined`
 * dashes the old month's clone (React DayPicker marks it `aria-hidden`).
 */
function CalendarSlide({
  reduced,
  outlined = false,
}: {
  reduced: boolean;
  outlined?: boolean;
}) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setStep((s) => s + 1), CALENDAR_SLIDE_MS * 2);
    return () => clearInterval(id);
  }, [reduced]);
  return (
    <Calendar
      // A mode makes the days buttons, so DayButton renders the dots.
      mode="single"
      month={new Date(2026, 9 + (step % 2), 1)}
      onMonthChange={() => {}}
      formatters={CALENDAR_FORMATTERS}
      components={CALENDAR_PARTS}
      className={`pointer-events-none rounded-lg border shadow-sm [--cell-size:--spacing(9)] [--godui-calendar-delay:60ms] [--godui-duration-base:780ms] [--godui-duration-fast:450ms] ${
        outlined
          ? "[&_[data-animated-month][aria-hidden=true]_[data-animated-weeks]>tr]:outline-1 [&_[data-animated-month][aria-hidden=true]_[data-animated-weeks]>tr]:-outline-offset-1 [&_[data-animated-month][aria-hidden=true]_[data-animated-weeks]>tr]:outline-[var(--foreground)]/40 [&_[data-animated-month][aria-hidden=true]_[data-animated-weeks]>tr]:outline-dashed"
          : ""
      }`}
    />
  );
}

function CalendarClone({ reduced }: { reduced: boolean }) {
  return <CalendarSlide reduced={reduced} outlined />;
}

/**
 * Pick a day (pop; the old one shrinks away), pick another, go to the next
 * month and back (the selected day comes back still), pick again. Slowed 2x.
 */
const CALENDAR_POP_STEPS = [
  { month: 9, day: 14 },
  { month: 9, day: 21 },
  { month: 10, day: 21 },
  { month: 9, day: 21 },
  { month: 9, day: 8 },
];

function CalendarPop({ reduced }: { reduced: boolean }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(
      () => setStep((s) => (s + 1) % CALENDAR_POP_STEPS.length),
      STEP_MS,
    );
    return () => clearInterval(id);
  }, [reduced]);
  const { month, day } = CALENDAR_POP_STEPS[step];
  return (
    <Calendar
      mode="single"
      month={new Date(2026, month, 1)}
      onMonthChange={() => {}}
      selected={new Date(2026, 9, day)}
      onSelect={() => {}}
      formatters={CALENDAR_FORMATTERS}
      components={CALENDAR_PARTS}
      className="pointer-events-none rounded-lg border shadow-sm [--cell-size:--spacing(9)] [--godui-duration-base:520ms] [--godui-duration-fast:300ms]"
    />
  );
}

/**
 * A range, picked: one day, then an end far away (the track sweeps out to
 * it), a nearer end (the rest fades), an end before the start (it sweeps
 * back the other way), and clear. The sweep is slowed to 0.9s.
 */
const CALENDAR_RANGE_STEPS: Array<[number, number] | null> = [
  [5, 5],
  [5, 23],
  [5, 14],
  [2, 14],
  null,
];

function CalendarRangeSweep({ reduced }: { reduced: boolean }) {
  const [step, setStep] = useState(reduced ? 1 : 0);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(
      () => setStep((s) => (s + 1) % CALENDAR_RANGE_STEPS.length),
      STEP_MS + 200,
    );
    return () => clearInterval(id);
  }, [reduced]);
  const range = CALENDAR_RANGE_STEPS[step];
  return (
    <Calendar
      mode="range"
      month={new Date(2026, 9, 1)}
      onMonthChange={() => {}}
      selected={
        range
          ? {
              from: new Date(2026, 9, range[0]),
              to: new Date(2026, 9, range[1]),
            }
          : undefined
      }
      onSelect={() => {}}
      formatters={CALENDAR_FORMATTERS}
      components={CALENDAR_PARTS}
      className="pointer-events-none rounded-lg border shadow-sm [--cell-size:--spacing(9)] [--godui-calendar-sweep:900ms] [--godui-duration-base:520ms] [--godui-duration-fast:300ms]"
    />
  );
}

/**
 * The range preview, with a scripted pointer: Oct 5 picked, the pointer
 * enters the grid and runs along a row (the ghost end rides the sweep's
 * front), back, down a row (it snaps), before the anchor (the track starts
 * over the other way), clicks (the preview is committed in place: the tint
 * deepens, the end pops) and leaves. Real mouseover/mouseout events with
 * their relatedTarget, as a browser sends them. Slowed 3x.
 */
const CALENDAR_PREVIEW_PATH: Array<number | "click" | "leave" | "reset"> = [
  9,
  10,
  11,
  12,
  13,
  14,
  12,
  10,
  16,
  23,
  22,
  2,
  1,
  "leave",
  15,
  16,
  17,
  "click",
  "leave",
  "reset",
];
const CALENDAR_PREVIEW_STEP_MS = 420;

function CalendarHoverPreview({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [end, setEnd] = useState<number | null>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const button = (d: number) =>
      host.querySelector<HTMLElement>(
        `td[data-day="2026-10-${String(d).padStart(2, "0")}"] button`,
      );
    let at: Element | null = null;
    const move = (to: Element) => {
      if (at)
        at.dispatchEvent(
          new MouseEvent("mouseout", { bubbles: true, relatedTarget: to }),
        );
      to.dispatchEvent(
        new MouseEvent("mouseover", { bubbles: true, relatedTarget: at }),
      );
      at = to;
    };
    const place = (el: Element | null) => {
      if (!el) return setCursor(null);
      const a = el.getBoundingClientRect();
      const b = host.getBoundingClientRect();
      setCursor({
        x: a.left - b.left + a.width / 2,
        y: a.top - b.top + a.height / 2,
      });
    };
    if (reduced) {
      const el = button(12);
      if (el) move(el);
      place(el);
      return;
    }
    let step = 0;
    const id = setInterval(() => {
      const next = CALENDAR_PREVIEW_PATH[step % CALENDAR_PREVIEW_PATH.length];
      step += 1;
      if (next === "click") {
        setEnd(Number(at?.closest("td")?.getAttribute("data-day")?.slice(-2)));
      } else if (next === "reset") {
        // A new round starts from the one picked day.
        setEnd(null);
      } else if (next === "leave") {
        move(host);
        place(null);
      } else {
        const el = button(next);
        if (el) {
          move(el);
          place(el);
        }
      }
    }, CALENDAR_PREVIEW_STEP_MS);
    return () => clearInterval(id);
  }, [reduced]);
  return (
    <div ref={ref} className="relative">
      <Calendar
        mode="range"
        month={new Date(2026, 9, 1)}
        onMonthChange={() => {}}
        selected={{
          from: new Date(2026, 9, 5),
          to: new Date(2026, 9, end ?? 5),
        }}
        onSelect={() => {}}
        formatters={CALENDAR_FORMATTERS}
        components={CALENDAR_PARTS}
        className="pointer-events-none rounded-lg border shadow-sm [--cell-size:--spacing(9)] [--godui-calendar-preview-sweep:480ms] [--godui-duration-base:780ms] [--godui-duration-fast:450ms]"
      />
      {cursor ? (
        <MousePointer2Icon
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 size-4 fill-foreground text-background transition-[translate] duration-300 ease-out"
          style={{ translate: `${cursor.x + 2}px ${cursor.y + 4}px` }}
        />
      ) : null}
    </div>
  );
}

const ACCORDION_ROWS = [
  { value: "a", title: "w-28", body: ["w-52", "w-44", "w-48"] },
  { value: "b", title: "w-36", body: ["w-48", "w-40"] },
  { value: "c", title: "w-24", body: ["w-44", "w-52"] },
];
/** a opens → b takes over (one closes as the other opens) → all closed. */
const ACCORDION_SEQUENCE = ["a", "b", ""];
const ACCORDION_SLOW_MS = 1200;

/**
 * The real Accordion on a slowed clock. `outlined` outlines each panel's clip
 * box, so you can see the box slide out from under its trigger while the bars
 * inside hold still.
 */
function AccordionSweep({
  reduced,
  outlined = false,
}: {
  reduced: boolean;
  outlined?: boolean;
}) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(
      () => setStep((s) => (s + 1) % ACCORDION_SEQUENCE.length),
      ACCORDION_SLOW_MS * 2,
    );
    return () => clearInterval(id);
  }, [reduced]);
  return (
    <Accordion
      type="single"
      collapsible
      value={ACCORDION_SEQUENCE[step]}
      onValueChange={() => {}}
      className="w-72 [--godui-duration-base:1200ms] [--godui-duration-fast:1200ms]"
    >
      {ACCORDION_ROWS.map((row) => (
        <AccordionItem
          key={row.value}
          value={row.value}
          // The outline is on the panel's clip box (the item's direct child),
          // not on the content inside it.
          className={
            outlined
              ? "[&>[data-slot=accordion-content]]:outline-1 [&>[data-slot=accordion-content]]:outline-[var(--foreground)]/40 [&>[data-slot=accordion-content]]:outline-dashed [&>[data-slot=accordion-content]]:-outline-offset-1"
              : undefined
          }
        >
          <AccordionTrigger tabIndex={-1} className="pointer-events-none">
            <Bar className={`${row.title} mt-1 bg-[var(--foreground)]/45`} />
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2.5 pt-1">
            {row.body.map((width) => (
              <Bar
                key={width}
                className={`${width} bg-[var(--foreground)]/20`}
              />
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

const COLLAPSIBLE_SLOW_MS = 1200;
const COLLAPSIBLE_ROW = "flex h-8 items-center rounded-md border px-3";

/**
 * The real Collapsible (shadcn's demo shape) on a slowed clock, opening and
 * closing on a timer. `outlined` outlines the panel box, so you can see it
 * slide out from under the row above while the rows inside hold still.
 */
function CollapsibleSweep({
  reduced,
  outlined = false,
}: {
  reduced: boolean;
  outlined?: boolean;
}) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setOpen((v) => !v), COLLAPSIBLE_SLOW_MS * 2);
    return () => clearInterval(id);
  }, [reduced]);
  return (
    <div className="flex w-64 flex-col gap-2 [--godui-duration-base:1200ms] [--godui-duration-fast:1200ms]">
      <Collapsible
        open={open}
        onOpenChange={() => {}}
        className="flex flex-col gap-2"
      >
        <div className="flex items-center justify-between gap-4 px-1">
          <Bar className="w-32 bg-[var(--foreground)]/45" />
          <CollapsibleTrigger
            tabIndex={-1}
            className="pointer-events-none size-6 rounded-md bg-[var(--foreground)]/10"
          />
        </div>
        <div className={COLLAPSIBLE_ROW}>
          <Bar className="w-28 bg-[var(--foreground)]/25" />
        </div>
        <CollapsibleContent
          className={
            outlined
              ? "flex flex-col gap-2 outline-1 outline-[var(--foreground)]/40 outline-dashed -outline-offset-1"
              : "flex flex-col gap-2"
          }
        >
          <div className={COLLAPSIBLE_ROW}>
            <Bar className="w-24 bg-[var(--foreground)]/25" />
          </div>
          <div className={COLLAPSIBLE_ROW}>
            <Bar className="w-32 bg-[var(--foreground)]/25" />
          </div>
        </CollapsibleContent>
      </Collapsible>
      <Bar className="mt-2 w-44 bg-[var(--foreground)]/20" />
      <Bar className="w-36 bg-[var(--foreground)]/20" />
    </div>
  );
}

/**
 * A real Collapsible inside another one's panel, the inner one toggling on a
 * slowed timer: the outer panel's edge and what follows the outer Collapsible
 * ride the inner edge, on one clock, and nothing glides twice.
 */
function CollapsibleNested({ reduced }: { reduced: boolean }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setOpen((v) => !v), COLLAPSIBLE_SLOW_MS * 2);
    return () => clearInterval(id);
  }, [reduced]);
  return (
    <div className="flex w-64 flex-col gap-2 [--godui-duration-base:1200ms] [--godui-duration-fast:1200ms]">
      <Collapsible open onOpenChange={() => {}} className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4 px-1">
          <Bar className="w-32 bg-[var(--foreground)]/45" />
          <CollapsibleTrigger
            tabIndex={-1}
            className="pointer-events-none size-6 rounded-md bg-[var(--foreground)]/10"
          />
        </div>
        <CollapsibleContent className="flex flex-col gap-2 pl-3">
          <div className={COLLAPSIBLE_ROW}>
            <Bar className="w-24 bg-[var(--foreground)]/25" />
          </div>
          <Collapsible
            open={open}
            onOpenChange={() => {}}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center justify-between gap-4 px-1">
              <Bar className="w-24 bg-[var(--foreground)]/35" />
              <CollapsibleTrigger
                tabIndex={-1}
                className="pointer-events-none size-5 rounded-md bg-[var(--foreground)]/10"
              />
            </div>
            <CollapsibleContent className="flex flex-col gap-2">
              <div className={COLLAPSIBLE_ROW}>
                <Bar className="w-20 bg-[var(--foreground)]/25" />
              </div>
              <div className={COLLAPSIBLE_ROW}>
                <Bar className="w-28 bg-[var(--foreground)]/25" />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CollapsibleContent>
      </Collapsible>
      <Bar className="mt-2 w-44 bg-[var(--foreground)]/20" />
      <Bar className="w-36 bg-[var(--foreground)]/20" />
    </div>
  );
}

function CollapsibleWindow({ reduced }: { reduced: boolean }) {
  return <CollapsibleSweep reduced={reduced} outlined />;
}

function CollapsibleGlide({ reduced }: { reduced: boolean }) {
  return <CollapsibleSweep reduced={reduced} />;
}

function AccordionWindow({ reduced }: { reduced: boolean }) {
  return <AccordionSweep reduced={reduced} outlined />;
}

function AccordionGlide({ reduced }: { reduced: boolean }) {
  return <AccordionSweep reduced={reduced} />;
}

/**
 * Forced focus: the scenes can't hold real focus on two fields (and shouldn't
 * steal it from the page), so `data-ring` stands in for `:focus-visible`.
 */
const INPUT_RING_ON =
  "data-[ring=on]:border-ring data-[ring=on]:ring-[3px] data-[ring=on]:ring-ring/50";
const GROUP_RING_ON =
  "data-[ring=on]:border-ring data-[ring=on]:before:scale-100 data-[ring=on]:before:opacity-100";

/** The real Input: shadcn's box-shadow ring, which snaps in GodUI. */
function SnappingField({ on }: { on: boolean }) {
  return (
    <div className="relative w-full">
      <Input
        tabIndex={-1}
        readOnly
        aria-label="Demo field"
        data-ring={on ? "on" : undefined}
        className={`pointer-events-none ${INPUT_RING_ON}`}
      />
      <Bar className="pointer-events-none absolute top-1/2 left-3 w-20 -translate-y-1/2 bg-[var(--foreground)]/25" />
    </div>
  );
}

/** The real Input Group: its ::before ring fades and grows in. */
function FadingField({ on, slowMs }: { on: boolean; slowMs: string }) {
  return (
    <InputGroup
      data-ring={on ? "on" : undefined}
      className={`pointer-events-none ${slowMs} ${GROUP_RING_ON}`}
    >
      <InputGroupInput tabIndex={-1} readOnly aria-label="Demo field" />
      <InputGroupAddon>
        <SearchIcon />
        <Bar className="w-20 bg-[var(--foreground)]/25" />
      </InputGroupAddon>
    </InputGroup>
  );
}

/** Left: Input (ring snaps). Right: Input Group (ring fades + grows in). */
function FocusRingCompare({ reduced }: { reduced: boolean }) {
  const on = useToggle(reduced) || reduced;
  return (
    <div className="grid w-full max-w-md grid-cols-2 gap-6 px-4">
      <SnappingField on={on} />
      <FadingField on={on} slowMs="[--godui-duration-fast:800ms]" />
    </div>
  );
}

/** The Input Group ring alone on a slow clock, so the 99% → 100% grow reads. */
function FocusRingSlow({ reduced }: { reduced: boolean }) {
  const on = useToggle(reduced) || reduced;
  return (
    <div className="w-full max-w-xs px-4">
      <FadingField on={on} slowMs="[--godui-duration-fast:1100ms]" />
    </div>
  );
}

/**
 * The real Slider, pressed on the timer. The press is imperative in the
 * component too (`data-pressed` on the root, `data-active` on the thumb it
 * moves), so the scene sets the same attributes a pointerdown would.
 */
function SliderPress({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const on = useToggle(reduced);
  useEffect(() => {
    const root = ref.current;
    const thumb = root?.querySelector('[data-slot="slider-thumb"]');
    if (!root || !thumb) return;
    root.toggleAttribute("data-pressed", on);
    thumb.toggleAttribute("data-active", on);
  }, [on]);
  return (
    <div className="w-64 scale-150">
      <Slider
        ref={ref}
        defaultValue={[60]}
        aria-label="Demo slider"
        className="pointer-events-none [--godui-duration-base:700ms] [--godui-duration-fast:700ms]"
      />
    </div>
  );
}

/** The thumb's ::before halo, forced on the timer (stands in for :hover). */
function SliderHalo({ reduced }: { reduced: boolean }) {
  const on = useToggle(reduced) || reduced;
  return (
    <div className="w-64 scale-150">
      <Slider
        defaultValue={[60]}
        aria-label="Demo slider"
        data-halo={on ? "on" : undefined}
        className="pointer-events-none [--godui-duration-fast:700ms] data-[halo=on]:[&_[data-slot=slider-thumb]]:before:scale-100 data-[halo=on]:[&_[data-slot=slider-thumb]]:before:opacity-100"
      />
    </div>
  );
}

const SLIDER_STEPS = [
  { one: 25, two: [20, 55] },
  { one: 80, two: [45, 90] },
  { one: 50, two: [10, 70] },
];

/**
 * Real Sliders on a slowed clock: a new `value` glides the thumb and the
 * range together, on one clock.
 */
function SliderGlide({ reduced }: { reduced: boolean }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(
      () => setStep((s) => (s + 1) % SLIDER_STEPS.length),
      STEP_MS * 1.5,
    );
    return () => clearInterval(id);
  }, [reduced]);
  const { one, two } = SLIDER_STEPS[step];
  return (
    <div className="flex w-72 flex-col gap-10">
      <Slider
        value={[one]}
        aria-label="Demo slider"
        className="pointer-events-none [--godui-duration-base:1100ms]"
      />
      <Slider
        value={two}
        aria-label="Demo range"
        className="pointer-events-none [--godui-duration-base:1100ms]"
      />
    </div>
  );
}

/** Sigmoid give past the end, as the Slider computes it (max 24px). */
const bandGive = (px: number) => 2 * (1 / (1 + Math.exp(-px / 24)) - 0.5) * 24;

/**
 * The rubber band, replayed on the real Slider: the scene writes what a drag
 * past the end writes (`data-overdrag`, the stretch vars on the track, the
 * thumb's ride), then lets go, and the component's own CSS springs it back.
 */
function SliderBand({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const root = ref.current;
    const track = root?.querySelector<HTMLElement>(
      '[data-slot="slider-track"]',
    );
    const thumb = root?.querySelector<HTMLElement>(
      '[data-slot="slider-thumb"]',
    );
    if (reduced || !root || !track || !thumb) return;
    let frame = 0;
    let start = 0;
    const PULL_MS = 700;
    const loop = (now: number) => {
      start ||= now;
      const t = (now - start) % (STEP_MS * 2);
      if (t < PULL_MS) {
        root.setAttribute("data-pressed", "");
        root.setAttribute("data-dragging", "");
        root.setAttribute("data-overdrag", "");
        thumb.setAttribute("data-active", "");
        const give = bandGive((t / PULL_MS) * 90);
        const len = track.offsetWidth || 1;
        track.style.setProperty("--godui-slider-origin", "0% 50%");
        track.style.setProperty(
          "--godui-slider-stretch",
          String(1 + give / len),
        );
        track.style.setProperty(
          "--godui-slider-thin",
          String(1 - (0.2 * give) / 24),
        );
        // The lift's scale applies outside the ride's transform.
        const lift = Number.parseFloat(getComputedStyle(thumb).scale) || 1;
        thumb.style.setProperty("--godui-slider-ride", `${give / lift}px, 0px`);
      } else if (root.hasAttribute("data-dragging")) {
        root.removeAttribute("data-pressed");
        root.removeAttribute("data-dragging");
        root.removeAttribute("data-overdrag");
        thumb.removeAttribute("data-active");
        track.style.removeProperty("--godui-slider-stretch");
        track.style.removeProperty("--godui-slider-thin");
        thumb.style.removeProperty("--godui-slider-ride");
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [reduced]);
  return (
    <div className="w-60 scale-150">
      <Slider
        ref={ref}
        defaultValue={[100]}
        aria-label="Demo slider"
        className="pointer-events-none [--godui-duration-slow:900ms]"
      />
    </div>
  );
}

const SIDEBAR_SLOW_MS = 900;
const SIDEBAR_ROWS = [
  { icon: SquareTerminalIcon, bar: "w-16" },
  { icon: BotIcon, bar: "w-12" },
  { icon: BookOpenIcon, bar: "w-20" },
  { icon: FrameIcon, bar: "w-14" },
];

/**
 * The real Sidebar on a slowed clock (900ms), its `open` flipping on a timer.
 * `outline` dashes the box that snaps: the container (`box`, icon mode: its
 * width snaps while the surface behind it slides) or the gap (`gap`: where the
 * content beside it is laid out at once, while it's drawn gliding).
 */
function SidebarMove({
  reduced,
  collapsible,
  outline,
}: {
  reduced: boolean;
  collapsible: "offcanvas" | "icon";
  outline?: "box" | "gap";
}) {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setOpen((v) => !v), SIDEBAR_SLOW_MS * 2);
    return () => clearInterval(id);
  }, [reduced]);
  const dashed =
    "outline-1 -outline-offset-1 outline-dashed outline-[var(--foreground)]/50";
  return (
    <SidebarProvider
      open={open}
      onOpenChange={() => {}}
      style={{ "--sidebar-width": "11rem" } as CSSProperties}
      className={`pointer-events-none relative h-64 min-h-0 w-[28rem] max-w-full overflow-hidden rounded-lg border [--godui-duration-base:900ms] [--godui-duration-fast:450ms] ${
        outline === "gap"
          ? "[&_[data-slot=sidebar-gap]]:outline-1 [&_[data-slot=sidebar-gap]]:-outline-offset-1 [&_[data-slot=sidebar-gap]]:outline-dashed [&_[data-slot=sidebar-gap]]:outline-[var(--foreground)]/50"
          : ""
      }`}
    >
      <Sidebar
        collapsible={collapsible}
        className={`absolute h-full ${outline === "box" ? dashed : ""}`}
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" tabIndex={-1}>
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEndIcon className="size-4" />
                </div>
                <span className="grid flex-1 gap-1.5">
                  <Bar className="w-16 bg-[var(--foreground)]/40" />
                  <Bar className="w-10 bg-[var(--foreground)]/20" />
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>
              <Bar className="w-10 bg-[var(--foreground)]/20" />
            </SidebarGroupLabel>
            <SidebarMenu>
              {SIDEBAR_ROWS.map((row, i) => (
                <SidebarMenuItem key={row.bar}>
                  <SidebarMenuButton tabIndex={-1} isActive={i === 0}>
                    <row.icon />
                    <Bar className={`${row.bar} bg-[var(--foreground)]/30`} />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex h-10 shrink-0 items-center gap-2 px-3">
          <SidebarTrigger tabIndex={-1} className="-ml-1" />
          <Bar className="w-20 bg-[var(--foreground)]/25" />
        </div>
        <div className="grid flex-1 grid-cols-2 gap-2 p-3 pt-0">
          <div className="rounded-md bg-[var(--muted)]" />
          <div className="rounded-md bg-[var(--muted)]" />
          <div className="col-span-2 rounded-md bg-[var(--muted)]" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function SidebarOffcanvas({ reduced }: { reduced: boolean }) {
  return <SidebarMove reduced={reduced} collapsible="offcanvas" />;
}

function SidebarSurface({ reduced }: { reduced: boolean }) {
  return <SidebarMove reduced={reduced} collapsible="icon" outline="box" />;
}

function SidebarGlide({ reduced }: { reduced: boolean }) {
  return <SidebarMove reduced={reduced} collapsible="icon" outline="gap" />;
}

const DEMOS = {
  accordion: AccordionGlide,
  "accordion-window": AccordionWindow,
  button: ButtonPress,
  calendar: CalendarSlide,
  "calendar-clone": CalendarClone,
  "calendar-pop": CalendarPop,
  "calendar-range": CalendarRangeSweep,
  "calendar-preview": CalendarHoverPreview,
  carousel: CarouselGlide,
  "carousel-jump": CarouselJump,
  checkbox: CheckboxToggle,
  collapsible: CollapsibleGlide,
  "collapsible-window": CollapsibleWindow,
  "collapsible-nested": CollapsibleNested,
  command: CommandCycle,
  "focus-ring": FocusRingCompare,
  "focus-ring-slow": FocusRingSlow,
  menubar: MenubarHop,
  "navigation-menu": NavigationMenuHop,
  "navigation-menu-snap": NavigationMenuSnap,
  progress: ProgressStep,
  "progress-indeterminate": ProgressIndeterminate,
  radio: RadioCycle,
  sidebar: SidebarOffcanvas,
  "sidebar-flip": SidebarGlide,
  "sidebar-surface": SidebarSurface,
  skeleton: SkeletonShimmer,
  "slider-band": SliderBand,
  "slider-glide": SliderGlide,
  "slider-halo": SliderHalo,
  "slider-press": SliderPress,
  "skeleton-pulse": SkeletonPulse,
  toggle: TogglePress,
  "toggle-group": ToggleGroupCycle,
  switch: SwitchToggle,
  tabs: TabsCycle,
} as const;

export type AutoPlayDemo = keyof typeof DEMOS;

/** Drives a real `@godui/components` component on a timer. */
export function AutoPlayScene({
  label,
  note,
  demo,
}: {
  label: string;
  note?: string;
  demo: AutoPlayDemo;
}) {
  const Demo = DEMOS[demo];
  return (
    <ScrollScene label={label} note={note}>
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className="flex min-h-48 w-full items-center justify-center"
        >
          <Demo reduced={reduced} />
        </div>
      )}
    </ScrollScene>
  );
}
