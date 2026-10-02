import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import type { DateRange } from "react-day-picker";
import { expectSlotParity, slotTree } from "../../test/parity";
import * as Shadcn from "../../test/shadcn/calendar";
import * as Godui from "./calendar";

const OCT = new Date(2026, 9, 1);
const SELECTED = new Date(2026, 9, 14);

function Single({ ui }: { ui: typeof Shadcn }) {
  const { Calendar } = ui;
  const [date, setDate] = React.useState<Date | undefined>(SELECTED);
  return (
    <Calendar
      mode="single"
      defaultMonth={OCT}
      selected={date}
      onSelect={setDate}
      className="rounded-md border shadow-sm"
      captionLayout="dropdown"
    />
  );
}

function Range({
  ui,
  initial = { from: new Date(2026, 9, 12), to: new Date(2026, 10, 3) },
  dir,
}: {
  ui: typeof Shadcn;
  initial?: DateRange;
  dir?: "rtl";
}) {
  const { Calendar } = ui;
  const [range, setRange] = React.useState<DateRange | undefined>(initial);
  return (
    <Calendar
      mode="range"
      defaultMonth={OCT}
      selected={range}
      onSelect={setRange}
      numberOfMonths={2}
      dir={dir}
      className="rounded-lg border shadow-sm"
    />
  );
}

const PKG = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const ROOT = join(PKG, "..", "..");
const css = readFileSync(join(PKG, "styles.css"), "utf8");

/** The live (not rdp's exiting clone) element matching `selector`. */
function live(selector: string) {
  return (
    [...document.querySelectorAll<HTMLElement>(selector)].find(
      (el) => !el.closest('[data-animated-month][aria-hidden="true"]'),
    ) ?? null
  );
}
const caption = () => live("[data-animated-caption]");
const liveWeeks = () => live("[data-animated-weeks]");
/** rdp's clone of the month being replaced, kept until its caption exit ends. */
const oldMonth = () =>
  document.querySelector<HTMLElement>(
    '[data-animated-month][aria-hidden="true"]',
  );
const oldCaption = () =>
  oldMonth()?.querySelector<HTMLElement>("[data-animated-caption]") ?? null;
/** End rdp's month change, as the old caption's animationend would. */
function finishMonthChange() {
  const el = oldCaption();
  if (el) fireEvent.animationEnd(el);
}
const iso = (month: number, day: number) =>
  `2026-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
const dayButton = (day: number, month = 9) => {
  const el = live(
    `td[data-day="${iso(month, day)}"]:not([data-outside]) button`,
  );
  if (!el) throw new Error(`no live day ${month}/${day}`);
  return el;
};
const layer = (button: HTMLElement, name: string) =>
  button.querySelector<HTMLElement>(`:scope > [data-calendar-layer="${name}"]`);
const fill = (button: HTMLElement) => layer(button, "fill");

const root = () => {
  const el = document.querySelector<HTMLElement>('[data-slot="calendar"]');
  if (!el) throw new Error("no calendar root");
  return el;
};

/** The `[--godui-calendar-*:value]` tuning classes on the root (`variant` e.g. "rtl:"). */
function tuning(variant = "") {
  const pattern = new RegExp(
    `^${variant}\\[--godui-calendar-([\\w-]+):(.+)\\]$`,
  );
  const vars: Record<string, string> = {};
  for (const name of root().classList) {
    const match = name.match(pattern);
    if (match?.[1] && match[2]) vars[match[1]] = match[2];
  }
  return vars;
}

/** `--animate-<name>`'s value in styles.css, whitespace collapsed. */
function token(name: string): string {
  const match = css.match(new RegExp(`--animate-${name}:([^;]+);`));
  if (!match?.[1]) throw new Error(`no token for ${name}`);
  return match[1]
    .replace(/\s+/g, " ")
    .replace(/\( /g, "(")
    .replace(/ \)/g, ")")
    .trim();
}

function keyframes(name: string): string {
  const start = css.indexOf(`@keyframes ${name} `);
  if (start < 0) throw new Error(`no @keyframes ${name}`);
  return css.slice(start, css.indexOf("\n}", start));
}

/** The sweep's slice for the `index`th of `length` halves (ease-out cubic front). */
const reachedAt = (x: number) => 1 - (1 - x) ** (1 / 3);
function slice(index: number, length: number) {
  const at = reachedAt(index / length);
  return { at, span: reachedAt((index + 1) / length) - at };
}
function trackVars(el: HTMLElement | null) {
  return {
    at: Number(el?.style.getPropertyValue("--godui-calendar-track-at")),
    span: Number(el?.style.getPropertyValue("--godui-calendar-track-span")),
  };
}
function expectSlice(el: HTMLElement | null, index: number, length: number) {
  const want = slice(index, length);
  const got = trackVars(el);
  expect(got.at).toBeCloseTo(want.at, 6);
  expect(got.span).toBeCloseTo(want.span, 6);
}
const startHalf = (button: HTMLElement) => layer(button, "track-start");
const endHalf = (button: HTMLElement) => layer(button, "track-end");

const NEW_KEYFRAMES = [
  "godui-calendar-in-from-end",
  "godui-calendar-in-from-start",
  "godui-calendar-out-to-start",
  "godui-calendar-out-to-end",
  "godui-calendar-caption-in-from-end",
  "godui-calendar-caption-in-from-start",
  "godui-calendar-caption-out-to-start",
  "godui-calendar-caption-out-to-end",
  "godui-calendar-caption-hide",
  "godui-calendar-fill-in",
  "godui-calendar-fade-out",
  "godui-calendar-fill-shrink",
  "godui-calendar-track-in",
];
const GATE = "not-in-[[data-animated-month][aria-hidden=true]]:data-animate:";

describe("Calendar", () => {
  it("matches shadcn's data-slot tree and exports (single, selected date)", () => {
    const { unmount } = render(<Single ui={Shadcn} />);
    const expected = slotTree();
    unmount();
    render(<Single ui={Godui} />);
    // The selected day's fill layer is rendered: layers carry no data-slot.
    expect(fill(dayButton(14))).not.toBeNull();
    expectSlotParity(slotTree(), expected);
    expect(Object.keys(Godui)).toEqual(
      expect.arrayContaining(Object.keys(Shadcn)),
    );
  });

  it("matches shadcn's data-slot tree (range, two months)", () => {
    const { unmount } = render(<Range ui={Shadcn} />);
    const expected = slotTree();
    unmount();
    render(<Range ui={Godui} />);
    expect(endHalf(dayButton(20))).not.toBeNull();
    expectSlotParity(slotTree(), expected);
  });

  it("Next changes the caption", async () => {
    const user = userEvent.setup();
    render(<Godui.Calendar defaultMonth={OCT} />);
    expect(caption()).toHaveTextContent("October 2026");
    await user.click(screen.getByRole("button", { name: /next month/i }));
    expect(caption()).toHaveTextContent("November 2026");
  });

  describe("month change", () => {
    // rdp adds these with classList.add, which throws on a token containing
    // whitespace — inside its layout effect that would unmount the calendar
    // on the first Next. Every test that clicks Next/Previous guards that.
    it("Next: the new weeks and caption drift in from the end, the old ones out to the start", async () => {
      const user = userEvent.setup();
      render(<Godui.Calendar defaultMonth={OCT} />);
      await user.click(screen.getByRole("button", { name: /next month/i }));
      expect(liveWeeks()).toHaveClass("animate-godui-calendar-in-from-end");
      expect(caption()).toHaveClass(
        "animate-godui-calendar-caption-in-from-end",
      );
      const old = oldMonth();
      expect(old).toHaveTextContent("October 2026");
      expect(old?.querySelector("[data-animated-weeks]")).toHaveClass(
        "animate-godui-calendar-out-to-start",
      );
      expect(oldCaption()).toHaveClass(
        "animate-godui-calendar-caption-out-to-start",
      );
    });

    it("Previous mirrors it", async () => {
      const user = userEvent.setup();
      render(<Godui.Calendar defaultMonth={OCT} />);
      await user.click(screen.getByRole("button", { name: /previous month/i }));
      expect(caption()).toHaveTextContent("September 2026");
      expect(liveWeeks()).toHaveClass("animate-godui-calendar-in-from-start");
      expect(caption()).toHaveClass(
        "animate-godui-calendar-caption-in-from-start",
      );
      expect(oldMonth()?.querySelector("[data-animated-weeks]")).toHaveClass(
        "animate-godui-calendar-out-to-end",
      );
      expect(oldCaption()).toHaveClass(
        "animate-godui-calendar-caption-out-to-end",
      );
    });

    it("tuning lives on the root: a quarter-width drift, a shorter exit, a caption that drifts less, mirrored in RTL", () => {
      render(<Godui.Calendar defaultMonth={OCT} />);
      expect(tuning()).toEqual({
        drift: "25%",
        "drift-out": "12%",
        "caption-drift": "14px",
        delay: "20ms",
        dir: "1",
        sweep: "240ms",
      });
      expect(tuning("rtl:")).toEqual({ dir: "-1" });
      // Every keyframe reads them, signed by the direction.
      for (const name of NEW_KEYFRAMES.slice(0, 8)) {
        expect(keyframes(name), name).toContain("var(--godui-calendar-dir)");
      }
    });

    it("your className overrides the tuning (the Storybook A/B uses a 100% drift)", () => {
      render(
        <Godui.Calendar
          defaultMonth={OCT}
          className="[--godui-calendar-drift:100%]"
        />,
      );
      expect(tuning().drift).toBe("100%");
      expect(root().className).not.toContain("[--godui-calendar-drift:25%]");
    });

    it("the exit is shorter and subtler than the enter, and the enter waits a beat", () => {
      // Exit: fast, no delay. Enter: base, after --godui-calendar-delay.
      expect(token("godui-calendar-out-to-start")).toMatch(
        /^godui-calendar-out-to-start var\(--godui-duration-fast\) cubic-bezier\([^)]*\) both$/,
      );
      expect(token("godui-calendar-in-from-end")).toBe(
        "godui-calendar-in-from-end var(--godui-duration-base) var(--ease-spring-snappy) calc(var(--godui-calendar-delay) * var(--godui-motion)) backwards",
      );
      expect(keyframes("godui-calendar-out-to-start")).toContain(
        "var(--godui-calendar-drift-out)",
      );
      expect(keyframes("godui-calendar-in-from-end")).toContain(
        "var(--godui-calendar-drift)",
      );
      // No blur: Chrome doesn't composite a filter that moves pixels.
      for (const name of NEW_KEYFRAMES) {
        expect(keyframes(name), name).not.toContain("filter");
      }
    });

    it("the old caption's single animation ends exactly when the new weeks land (rdp cleans up on it)", async () => {
      const user = userEvent.setup();
      render(<Godui.Calendar defaultMonth={OCT} />);
      await user.click(screen.getByRole("button", { name: /next month/i }));
      // The new weeks end at delay + base...
      const enterEnd =
        "var(--godui-duration-base) var(--ease-spring-snappy) calc(var(--godui-calendar-delay) * var(--godui-motion))";
      expect(token("godui-calendar-in-from-end")).toContain(enterEnd);
      // The caption starts 40ms later and runs 40ms shorter: same end.
      expect(token("godui-calendar-caption-in-from-end")).toContain(
        "calc(var(--godui-duration-base) - 40ms * var(--godui-motion)) var(--ease-spring-snappy) calc((var(--godui-calendar-delay) + 40ms) * var(--godui-motion))",
      );
      // ...and so does the caption's exit: no earlier, or the cleanup would
      // cut the enter short.
      const exitDuration =
        "calc(var(--godui-duration-base) + var(--godui-calendar-delay) * var(--godui-motion))";
      for (const name of [
        "godui-calendar-caption-out-to-start",
        "godui-calendar-caption-out-to-end",
        "godui-calendar-caption-hide",
      ]) {
        expect(token(name)).toBe(`${name} ${exitDuration} linear both`);
      }
      // Its fade is front-loaded: gone by 30%, then held — before the new
      // caption shows, so the two never overlap as text on text.
      expect(keyframes("godui-calendar-caption-out-to-start")).toMatch(
        /30%,\s*100% \{\s*opacity: 0;/,
      );
      // It's the only animation in the old caption's subtree: a descendant's
      // animationend would bubble and trigger the cleanup early.
      const animated = [
        oldCaption(),
        ...(oldCaption()?.querySelectorAll("*") ?? []),
      ].filter((el) => el?.className.toString().includes("animate-"));
      expect(animated).toEqual([oldCaption()]);
    });

    it("removes the old month only on the old caption's animationend", async () => {
      const user = userEvent.setup();
      render(<Godui.Calendar defaultMonth={OCT} />);
      await user.click(screen.getByRole("button", { name: /next month/i }));
      // A second click mid-change is skipped by rdp; the old month stays.
      await user.click(screen.getByRole("button", { name: /next month/i }));
      expect(oldMonth()).not.toBeNull();
      finishMonthChange();
      expect(oldMonth()).toBeNull();
      expect(liveWeeks()?.className).not.toContain("animate-godui-calendar");
    });

    it("dropdown caption: the dropdowns don't move or fade; the old caption hides at once and still ends the change", async () => {
      const user = userEvent.setup();
      render(<Single ui={Godui} />);
      await user.click(screen.getByRole("button", { name: /next month/i }));
      // The weeks still drift...
      expect(liveWeeks()).toHaveClass("animate-godui-calendar-in-from-end");
      // ...the new caption (its selects) shows at once...
      expect(caption()).toHaveClass("animate-none");
      expect(caption()?.className).not.toContain("animate-godui");
      expect(caption()?.querySelector("select")).not.toBeNull();
      // ...and the old one is hidden for the whole change, so it never ghosts
      // over the new selects; its animation is still the cleanup's clock.
      expect(oldCaption()).toHaveClass("animate-godui-calendar-caption-hide");
      // 0 → 0.01: invisible, but a visible change, so Chrome composites it.
      expect(keyframes("godui-calendar-caption-hide")).toMatch(
        /from \{\s*opacity: 0;\s*\}\s*to \{\s*opacity: 0\.01;\s*\}/,
      );
      finishMonthChange();
      expect(oldMonth()).toBeNull();
    });

    it("dropdown-months / dropdown-years captions are static too", async () => {
      const user = userEvent.setup();
      render(
        <Godui.Calendar defaultMonth={OCT} captionLayout="dropdown-months" />,
      );
      await user.click(screen.getByRole("button", { name: /next month/i }));
      expect(oldCaption()).toHaveClass("animate-godui-calendar-caption-hide");
    });

    it("your own classNames.weeks / month_caption keep the month change's timing", async () => {
      const user = userEvent.setup();
      render(
        <Godui.Calendar
          defaultMonth={OCT}
          className="rounded-md border"
          classNames={{ weeks: "my-weeks", month_caption: "my-caption" }}
        />,
      );
      await user.click(screen.getByRole("button", { name: /next month/i }));
      expect(liveWeeks()).toHaveClass(
        "my-weeks",
        "animate-godui-calendar-in-from-end",
      );
      expect(caption()).toHaveClass("my-caption");
      expect(root()).toHaveClass("rounded-md", "border");
      // Timing is in the keyframes' tokens and the root's tuning, not in the
      // classNames you replaced.
      expect(tuning().drift).toBe("25%");
      expect(oldMonth()?.querySelector(".my-caption")).toHaveClass(
        "animate-godui-calendar-caption-out-to-start",
      );
    });

    it("animate={false} opts out of the month change", async () => {
      const user = userEvent.setup();
      render(<Godui.Calendar defaultMonth={OCT} animate={false} />);
      await user.click(screen.getByRole("button", { name: /next month/i }));
      expect(document.querySelector("[data-animated-month]")).toBeNull();
      expect(caption()).toBeNull();
    });

    it("caller classNames win", async () => {
      const user = userEvent.setup();
      render(
        <Godui.Calendar
          defaultMonth={OCT}
          classNames={{ weeks_after_enter: "my-enter" }}
        />,
      );
      await user.click(screen.getByRole("button", { name: /next month/i }));
      expect(liveWeeks()).toHaveClass("my-enter");
      expect(liveWeeks()?.className).not.toContain("in-from-end");
    });

    it("height: months snap between five and six weeks; fixedWeeks always shows six", () => {
      // No size animation anywhere: the rows simply appear or go.
      for (const name of NEW_KEYFRAMES) {
        expect(keyframes(name), name).not.toMatch(/height|width|grid/);
      }
      render(<Godui.Calendar defaultMonth={OCT} fixedWeeks />);
      expect(liveWeeks()?.querySelectorAll("tr")).toHaveLength(6);
    });
  });

  describe("selection", () => {
    it("a picked day pops a fill layer carrying its own copy of the number; the old one shrinks away", async () => {
      const user = userEvent.setup();
      render(<Single ui={Godui} />);
      await user.click(dayButton(20));
      const day = dayButton(20);
      expect(day).toHaveAttribute("data-selected-single", "true");
      const layer = fill(day);
      expect(layer).toHaveAttribute("data-state", "on");
      expect(layer).toHaveAttribute("data-animate", "true");
      expect(layer).toHaveAttribute("aria-hidden", "true");
      expect(layer).not.toHaveAttribute("data-slot");
      expect(layer).toHaveTextContent("20");
      expect(layer?.className).toContain(
        "not-in-[[data-animated-month][aria-hidden=true]]:data-animate:animate-godui-calendar-fill-in",
      );
      // The fill is the layer's ::before; the layer's text is primary-foreground.
      expect(layer).toHaveClass("text-primary-foreground", "before:bg-primary");
      // The button's own fill and number colour no longer change.
      expect(day.className).not.toMatch(/(^|\s)\S*:bg-primary(\s|$)/);
      expect(day.className).not.toContain("text-primary-foreground");
      // The deselected day's layer stays mounted and animates out: the
      // layer (number included) fades, its ::before fill shrinks. Keyframes,
      // not transitions — after an opacity transition Chrome won't composite
      // the next pop's opacity keyframe on the same element.
      const ghost = fill(dayButton(14));
      expect(ghost).toHaveAttribute("data-state", "off");
      expect(ghost).toHaveAttribute("data-animate", "true");
      expect(ghost).toHaveClass(
        "opacity-0",
        `${GATE}animate-godui-calendar-fade-out`,
        `${GATE}before:animate-godui-calendar-fill-shrink`,
      );
      expect(ghost?.className).not.toContain("transition");
      // From 1 explicitly: the leaving layer's own style is already 0.
      expect(keyframes("godui-calendar-fade-out")).toMatch(
        /from \{\s*opacity: 1;\s*\}\s*to \{\s*opacity: 0;/,
      );
      expect(keyframes("godui-calendar-fill-shrink")).toContain(
        "scale: calc(1 - 0.15 * var(--godui-motion))",
      );
    });

    it("re-picking a deselected day pops it again", async () => {
      const user = userEvent.setup();
      render(<Single ui={Godui} />);
      await user.click(dayButton(20));
      await user.click(dayButton(14));
      expect(fill(dayButton(14))).toHaveAttribute("data-animate", "true");
      expect(fill(dayButton(20))).toHaveAttribute("data-state", "off");
      expect(fill(dayButton(20))).toHaveClass(
        `${GATE}animate-godui-calendar-fade-out`,
      );
    });

    it("the pop keyframe scales the fill from 60% and fades it in over its first third", () => {
      expect(token("godui-calendar-fill-in")).toBe(
        "godui-calendar-fill-in var(--godui-duration-base) var(--ease-spring-bouncy) backwards",
      );
      expect(keyframes("godui-calendar-fill-in")).toContain(
        "scale: calc(1 - 0.4 * var(--godui-motion))",
      );
      expect(keyframes("godui-calendar-fill-in")).toMatch(
        /35% \{\s*opacity: 1;/,
      );
    });

    it("the day button keeps its press scale (the pop is on the layer now)", async () => {
      render(<Single ui={Godui} />);
      const day = dayButton(14);
      expect(day).toHaveClass("active:scale-[0.97]");
      expect(day.className).not.toContain("active:scale-none");
      expect(day).toHaveClass("relative", "isolate");
    });

    it("mount rule: nothing pops on first paint or month navigation", async () => {
      const user = userEvent.setup();
      render(<Single ui={Godui} />);
      expect(fill(dayButton(14))).toHaveAttribute("data-state", "on");
      expect(fill(dayButton(14))).not.toHaveAttribute("data-animate");
      await user.click(screen.getByRole("button", { name: /next month/i }));
      finishMonthChange();
      await user.click(screen.getByRole("button", { name: /previous month/i }));
      expect(fill(dayButton(14))).toHaveAttribute("data-state", "on");
      expect(fill(dayButton(14))).not.toHaveAttribute("data-animate");
      // No other day has a layer: unselected days render none.
      expect(fill(dayButton(15))).toBeNull();
    });

    it("mount rule: a controlled re-render with the same date doesn't pop; a new date does", () => {
      const onSelect = () => {};
      const view = (selected: Date) => (
        <Godui.Calendar
          mode="single"
          defaultMonth={OCT}
          selected={selected}
          onSelect={onSelect}
        />
      );
      const { rerender } = render(view(SELECTED));
      rerender(view(new Date(2026, 9, 14)));
      expect(fill(dayButton(14))).not.toHaveAttribute("data-animate");
      rerender(view(new Date(2026, 9, 21)));
      expect(fill(dayButton(21))).toHaveAttribute("data-animate", "true");
      expect(fill(dayButton(14))).toHaveAttribute("data-state", "off");
    });

    it("the exiting clone of a just-popped day doesn't replay the pop", async () => {
      const user = userEvent.setup();
      render(<Godui.Calendar mode="single" defaultMonth={OCT} />);
      await user.click(dayButton(20));
      await user.click(screen.getByRole("button", { name: /next month/i }));
      // rdp's clone copies the layer with data-animate...
      const clone = oldMonth()?.querySelector<HTMLElement>(
        `td[data-day="${iso(9, 20)}"] [data-calendar-layer="fill"]`,
      );
      expect(clone).toHaveAttribute("data-animate", "true");
      // ...inside the ancestor the gate excludes.
      expect(
        clone?.closest('[data-animated-month][aria-hidden="true"]'),
      ).not.toBeNull();
      expect(clone?.className).toContain(
        "not-in-[[data-animated-month][aria-hidden=true]]:data-animate:animate-godui-calendar-fill-in",
      );
    });
  });

  describe("range", () => {
    it("a half that leaves and comes back sweeps in again", async () => {
      const user = userEvent.setup();
      render(<Range ui={Godui} />);
      await user.click(dayButton(20)); // shrink to Oct 12 – 20
      await user.click(dayButton(25)); // extend to Oct 25
      const half = startHalf(dayButton(23));
      expect(half).toHaveAttribute("data-state", "on");
      expect(half).toHaveAttribute("data-animate", "true");
      expect(half).toHaveClass(`${GATE}animate-godui-calendar-track-in`);
      expect(half?.className).not.toContain("fade-out");
    });

    it("steady state: the middle and the ends' inner halves carry the accent track, square at the ends", () => {
      render(<Range ui={Godui} />);
      const start = dayButton(12);
      expect(startHalf(start)).toHaveAttribute("data-state", "off");
      expect(endHalf(start)).toHaveAttribute("data-state", "on");
      expect(endHalf(start)?.className).not.toContain("[inherit]");
      const middle = dayButton(20);
      expect(startHalf(middle)).toHaveAttribute("data-state", "on");
      expect(endHalf(middle)).toHaveAttribute("data-state", "on");
      expect(startHalf(middle)).toHaveClass(
        "rounded-ss-[inherit]",
        "rounded-es-[inherit]",
      );
      const end = dayButton(3, 10);
      expect(startHalf(end)).toHaveAttribute("data-state", "on");
      expect(endHalf(end)).toHaveAttribute("data-state", "off");
      // Logical halves, so RTL draws them on the right side.
      expect(startHalf(middle)).toHaveClass("start-0", "end-1/2");
      expect(endHalf(middle)).toHaveClass("start-1/2", "end-0");
      expect(startHalf(middle)).toHaveClass("bg-accent", "-z-10");
      // Nothing sweeps on first paint.
      expect(
        document.querySelector("[data-calendar-layer][data-animate]"),
      ).toBeNull();
      // The cell no longer paints shadcn's accent behind the ends.
      expect(start.closest("td")?.className).not.toContain("bg-accent");
    });

    it("extending forward sweeps only the new part, outward from the drawn part, one slice per half", async () => {
      const user = userEvent.setup();
      render(<Range ui={Godui} />);
      await user.click(dayButton(5, 10));
      // New halves: Nov 3 end, Nov 4 start + end, Nov 5 start.
      const halves = [
        endHalf(dayButton(3, 10)),
        startHalf(dayButton(4, 10)),
        endHalf(dayButton(4, 10)),
        startHalf(dayButton(5, 10)),
      ];
      halves.forEach((half, i) => {
        expect(half).toHaveAttribute("data-state", "on");
        expect(half).toHaveAttribute("data-animate", "true");
        expect(half).toHaveAttribute("data-sweep", "forward");
        expect(half).toHaveClass("origin-left", "rtl:origin-right");
        expectSlice(half, i, halves.length);
      });
      // Halves already drawn stay still.
      for (const button of [dayButton(20), dayButton(2, 10)]) {
        expect(startHalf(button)).not.toHaveAttribute("data-animate");
        expect(endHalf(button)).not.toHaveAttribute("data-animate");
      }
      expect(startHalf(dayButton(3, 10))).not.toHaveAttribute("data-animate");
      // The new end pops; the old end's fill shrinks away.
      expect(fill(dayButton(5, 10))).toHaveAttribute("data-animate", "true");
      expect(fill(dayButton(3, 10))).toHaveAttribute("data-state", "off");
    });

    it("extending backward sweeps back from the drawn part", async () => {
      const user = userEvent.setup();
      render(<Range ui={Godui} />);
      await user.click(dayButton(8));
      // New halves, nearest the drawn part first: Oct 12 start, Oct 11 end,
      // Oct 11 start, … Oct 8 end — 8 halves.
      const order = [
        startHalf(dayButton(12)),
        endHalf(dayButton(11)),
        startHalf(dayButton(11)),
        endHalf(dayButton(10)),
        startHalf(dayButton(10)),
        endHalf(dayButton(9)),
        startHalf(dayButton(9)),
        endHalf(dayButton(8)),
      ];
      order.forEach((half, i) => {
        expect(half).toHaveAttribute("data-sweep", "backward");
        expect(half).toHaveClass("origin-right", "rtl:origin-left");
        expectSlice(half, i, order.length);
      });
      expect(startHalf(dayButton(8))).toHaveAttribute("data-state", "off");
    });

    it("a new range sweeps away from the day picked first, across the month boundary, as one continuous front", async () => {
      const user = userEvent.setup();
      render(<Range ui={Godui} />);
      // Clicking the start collapses the range to that one day...
      await user.click(dayButton(28));
      await user.click(dayButton(28));
      expect(endHalf(dayButton(28))).toHaveAttribute("data-state", "off");
      // ...the next click makes a new range from it: Oct 28 → Nov 2.
      await user.click(dayButton(2, 10));
      const halves = [
        endHalf(dayButton(28)),
        startHalf(dayButton(29)),
        endHalf(dayButton(29)),
        startHalf(dayButton(30)),
        endHalf(dayButton(30)),
        startHalf(dayButton(31)),
        endHalf(dayButton(31)),
        startHalf(dayButton(1, 10)),
        endHalf(dayButton(1, 10)),
        startHalf(dayButton(2, 10)),
      ];
      let edge = 0;
      halves.forEach((half, i) => {
        expect(half).toHaveAttribute("data-sweep", "forward");
        expectSlice(half, i, halves.length);
        // Each half starts where the previous one ends.
        const { at, span } = trackVars(half);
        expect(at).toBeCloseTo(edge, 6);
        edge = at + span;
      });
      // The whole sweep fills its duration exactly, whatever its length.
      expect(edge).toBeCloseTo(1, 6);
    });

    it("picking the new start before the anchor sweeps backward from the anchor", async () => {
      const user = userEvent.setup();
      render(
        <Range
          ui={Godui}
          initial={{ from: new Date(2026, 9, 20), to: new Date(2026, 9, 20) }}
        />,
      );
      await user.click(dayButton(17));
      expect(endHalf(dayButton(19))).toHaveAttribute("data-sweep", "backward");
      expectSlice(startHalf(dayButton(20)), 0, 6);
      expectSlice(endHalf(dayButton(17)), 5, 6);
    });

    it("shrinking: the halves that leave fade out, none sweep", async () => {
      const user = userEvent.setup();
      render(<Range ui={Godui} />);
      await user.click(dayButton(20));
      for (const button of [dayButton(21), dayButton(2, 10)]) {
        const half = startHalf(button);
        expect(half).toHaveAttribute("data-state", "off");
        expect(half).toHaveAttribute("data-animate", "true");
        expect(half).toHaveClass(
          "opacity-0",
          `${GATE}animate-godui-calendar-fade-out`,
        );
      }
      expect(
        document.querySelector(
          "[data-calendar-layer^=track][data-state=on][data-animate]",
        ),
      ).toBeNull();
      expect(endHalf(dayButton(20))).toHaveAttribute("data-state", "off");
      expect(fill(dayButton(20))).toHaveAttribute("data-animate", "true");
    });

    it("RTL: the sweep grows from the other side", async () => {
      const user = userEvent.setup();
      render(<Range ui={Godui} dir="rtl" />);
      expect(root()).toHaveAttribute("dir", "rtl");
      await user.click(dayButton(5, 10));
      // `rtl:origin-right` wins under dir=rtl for a forward sweep.
      expect(startHalf(dayButton(5, 10))).toHaveClass("rtl:origin-right");
      expect(tuning("rtl:").dir).toBe("-1");
    });

    it("a range end moving from the second month to the first doesn't pop or sweep", async () => {
      const user = userEvent.setup();
      render(<Range ui={Godui} />);
      await user.click(screen.getByRole("button", { name: /next month/i }));
      expect(caption()).toHaveTextContent("November 2026");
      const end = dayButton(3, 10);
      expect(end).toHaveAttribute("data-range-end", "true");
      expect(fill(end)).not.toHaveAttribute("data-animate");
      finishMonthChange();
      await user.click(screen.getByRole("button", { name: /previous month/i }));
      expect(
        document.querySelector("[data-calendar-layer][data-animate]"),
      ).toBeNull();
    });

    it("the sweep's slice is timed from the tokens: linear, delayed by its start, both scaled by --godui-motion", () => {
      expect(token("godui-calendar-track-in")).toBe(
        "godui-calendar-track-in calc(var(--godui-calendar-track-span, 1) * var(--godui-calendar-sweep) * var(--godui-motion) + var(--godui-duration-fast) * (1 - var(--godui-motion))) linear calc(var(--godui-calendar-track-at, 0) * var(--godui-calendar-sweep) * var(--godui-motion)) backwards",
      );
      expect(keyframes("godui-calendar-track-in")).toContain(
        "scale: calc(1 - var(--godui-motion)) 1",
      );
    });
  });

  describe("hover and focus", () => {
    it("hover fades an accent overlay instead of switching the background", () => {
      render(<Single ui={Godui} />);
      const day = dayButton(15);
      expect(day).toHaveClass(
        "hover:bg-transparent",
        "dark:hover:bg-transparent",
        "after:bg-accent",
        "after:opacity-0",
        "after:transition-[opacity]",
        "hover:after:opacity-100",
        "dark:after:bg-accent/50",
      );
      expect(day.className).not.toContain("hover:bg-accent");
    });

    it("the focus ring is a ::before layer: it fades in on entering the grid and jumps between days on arrow keys", async () => {
      const user = userEvent.setup();
      render(<Single ui={Godui} />);
      const day = dayButton(14);
      expect(day).toHaveClass(
        "focus-visible:ring-0",
        "before:ring-[3px]",
        "before:opacity-0",
        // Without it the ::before transitions `all` (its duration is set):
        // the day's text colour and corners would animate off the GPU.
        "before:transition-none",
        "group-data-[focused=true]/day:before:opacity-100",
        "group-data-[focused=true]/day:not-data-[focus-ring=snap]:before:transition-[opacity,scale]",
      );
      expect(day.className).not.toContain(
        "group-data-[focused=true]/day:ring-",
      );
      // Focus enters the grid: fade.
      day.focus();
      await user.keyboard("{ArrowRight}");
      const next = dayButton(15);
      expect(next).toHaveFocus();
      expect(next.closest("td")).toHaveAttribute("data-focused", "true");
      // Moved by a key, from another day: snap.
      expect(next).toHaveAttribute("data-focus-ring", "snap");
      await user.keyboard("{ArrowDown}");
      expect(dayButton(22)).toHaveAttribute("data-focus-ring", "snap");
    });

    it("tabbing into the grid fades the ring in", async () => {
      const user = userEvent.setup();
      render(<Single ui={Godui} />);
      await user.tab(); // previous month
      await user.tab(); // next month
      await user.tab(); // month select
      await user.tab(); // year select
      await user.tab(); // the selected day
      expect(dayButton(14)).toHaveFocus();
      expect(dayButton(14)).toHaveAttribute("data-focus-ring", "fade");
    });
  });

  describe("reduced motion", () => {
    it("every new keyframe scales its movement and scale by --godui-motion", () => {
      for (const name of NEW_KEYFRAMES) {
        const block = keyframes(name);
        if (/translate:|scale:/.test(block)) {
          for (const line of block.split(";")) {
            if (/translate:|scale:/.test(line) && !/: 0 0$/.test(line.trim())) {
              expect(line, name).toContain("var(--godui-motion)");
            }
          }
        }
      }
    });

    it("delays scale by --godui-motion, so changes start at once", () => {
      for (const name of [
        "godui-calendar-in-from-end",
        "godui-calendar-in-from-start",
      ]) {
        expect(token(name), name).toContain(
          "calc(var(--godui-calendar-delay) * var(--godui-motion))",
        );
      }
      for (const name of [
        "godui-calendar-caption-in-from-end",
        "godui-calendar-caption-in-from-start",
      ]) {
        expect(token(name), name).toContain(
          "calc((var(--godui-calendar-delay) + 40ms) * var(--godui-motion))",
        );
      }
      expect(token("godui-calendar-track-in")).toContain(
        "calc(var(--godui-calendar-track-at, 0) * var(--godui-calendar-sweep) * var(--godui-motion))",
      );
    });

    it("the range sweep becomes a plain fade, the ring and ghost stop scaling", () => {
      // motion 0: track halves start at opacity 0 and full width, over fast.
      expect(keyframes("godui-calendar-track-in")).toContain(
        "opacity: var(--godui-motion)",
      );
      render(<Single ui={Godui} />);
      expect(dayButton(14)).toHaveClass(
        "before:scale-[calc(1-0.02*var(--godui-motion))]",
      );
    });
  });

  it("the registry entry ships exactly the keyframes and tokens in styles.css", () => {
    const registry = JSON.parse(
      readFileSync(join(ROOT, "registry.json"), "utf8"),
    );
    const entry = registry.items.find(
      (i: { name: string }) => i.name === "calendar",
    );
    const theme = entry.cssVars.theme as Record<string, string>;
    expect(Object.keys(theme).sort()).toEqual(
      NEW_KEYFRAMES.map((k) => `animate-${k}`).sort(),
    );
    for (const name of NEW_KEYFRAMES) {
      expect(theme[`animate-${name}`], name).toBe(token(name));
      expect(entry.css[`@keyframes ${name}`], name).toBeDefined();
    }
    // Not in the shared theme entry.
    const godTheme = registry.items.find(
      (i: { name: string }) => i.name === "godui-theme",
    );
    expect(JSON.stringify(godTheme ?? {})).not.toContain("godui-calendar");
  });
});
