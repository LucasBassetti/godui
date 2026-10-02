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
import { Bold, Circle, SearchIcon } from "lucide-react";
import {
  type ComponentProps,
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
 */
function NavigationMenuHop({ reduced }: { reduced: boolean }) {
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
      <NavigationMenu value={NAV_ITEMS[NAV_ORDER[step]].value}>
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
 * Real Calendar, wordless, on a slowed clock: the controlled `month`
 * alternates Next and Previous, so the strip slides both ways. `outlined`
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
      className={`pointer-events-none rounded-lg border shadow-sm [--cell-size:--spacing(9)] [--godui-duration-base:800ms] ${
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
 * Pick a day (pop), pick another (pop), go to the next month and back (the
 * selected day comes back still), pick again (pop).
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
      className="pointer-events-none rounded-lg border shadow-sm [--cell-size:--spacing(9)]"
    />
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

/** The Input Group ring alone on a slow clock, so the 98% → 100% grow reads. */
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
 * past the end writes (`data-dragging`, the stretch vars on the track, the
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
        thumb.style.setProperty("--godui-slider-ride", `${give}px, 0px`);
      } else if (root.hasAttribute("data-dragging")) {
        root.removeAttribute("data-pressed");
        root.removeAttribute("data-dragging");
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

const DEMOS = {
  accordion: AccordionGlide,
  "accordion-window": AccordionWindow,
  button: ButtonPress,
  calendar: CalendarSlide,
  "calendar-clone": CalendarClone,
  "calendar-pop": CalendarPop,
  carousel: CarouselGlide,
  "carousel-jump": CarouselJump,
  checkbox: CheckboxToggle,
  command: CommandCycle,
  "focus-ring": FocusRingCompare,
  "focus-ring-slow": FocusRingSlow,
  menubar: MenubarHop,
  "navigation-menu": NavigationMenuHop,
  progress: ProgressStep,
  "progress-indeterminate": ProgressIndeterminate,
  radio: RadioCycle,
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
