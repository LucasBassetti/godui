import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { act, fireEvent, render, screen } from "@testing-library/react";
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

/** `@keyframes name` from styles.css as the registry writes it: selector → declarations. */
function keyframeObject(name: string) {
  const body = keyframes(name).replace(/\/\*[\s\S]*?\*\//g, "");
  const norm = (v: string) =>
    v.replace(/\s+/g, " ").replace(/\( /g, "(").replace(/ \)/g, ")").trim();
  const frames: Record<string, Record<string, string>> = {};
  for (const [, selector, decls] of body
    .slice(body.indexOf("{") + 1)
    .matchAll(/([^{}]+?)\s*\{([^{}]*)\}/g)) {
    const out: Record<string, string> = {};
    for (const decl of (decls ?? "").split(";")) {
      const at = decl.indexOf(":");
      if (at > 0) out[decl.slice(0, at).trim()] = norm(decl.slice(at + 1));
    }
    frames[(selector ?? "").trim().replace(/\s*,\s*/g, ", ")] = out;
  }
  return frames;
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

/**
 * Fire `animationend` with its AnimationEvent fields (jsdom has no
 * AnimationEvent, so they're set on a plain bubbling Event).
 */
function animationEnd(el: Element, animationName: string, pseudoElement = "") {
  const event = new Event("animationend", { bubbles: true });
  Object.assign(event, { animationName, pseudoElement, elapsedTime: 0 });
  act(() => {
    el.dispatchEvent(event);
  });
}

/** End the fill layer's own animation, as the browser would. */
function endFill(button: HTMLElement) {
  const el = fill(button);
  if (!el) throw new Error("no fill layer");
  animationEnd(
    el,
    el.dataset.state === "on"
      ? "godui-calendar-fill-in"
      : "godui-calendar-fade-out",
  );
}

/**
 * A settled selected day: the fill layer rests under the button's own number
 * (z -10, after the track halves), without a copy; the number turns
 * primary-foreground and is in the DOM once.
 */
function expectSettledFill(button: HTMLElement, day: number) {
  const layer = fill(button);
  expect(layer).toHaveAttribute("data-state", "on");
  expect(layer).toHaveClass("-z-10", "before:bg-primary");
  expect(layer?.textContent).toBe("");
  // Above the range track: later in the same (negative) layer.
  const track = layer?.parentElement?.querySelectorAll(
    ":scope > [data-calendar-layer^=track]",
  );
  for (const half of track ?? []) {
    expect(
      half.compareDocumentPosition(layer as Node) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(half).toHaveClass("-z-10");
  }
  expect(button).toHaveAttribute("data-fill", "settled");
  expect(button).toHaveClass("text-primary-foreground");
  // The button's own background never fills: the track would paint over it.
  expect(button.className).not.toMatch(/(^|\s)(\S+:)?bg-primary(\s|$)/);
  expect(button.textContent).toBe(String(day));
}

describe("Calendar", () => {
  // A fill layer settles at once if nothing animates it (getAnimations()
  // empty). jsdom runs no CSS animations, so stand in a running one; the
  // fallback's own tests override this.
  const getAnimations = HTMLElement.prototype.getAnimations;
  beforeEach(() => {
    HTMLElement.prototype.getAnimations = () => [{} as Animation];
  });
  afterEach(() => {
    HTMLElement.prototype.getAnimations = getAnimations;
  });

  it("matches shadcn's data-slot tree and exports (single, selected date)", () => {
    const { unmount } = render(<Single ui={Shadcn} />);
    const expected = slotTree();
    unmount();
    render(<Single ui={Godui} />);
    // At rest the selected day paints shadcn's fill itself, no layer.
    expectSettledFill(dayButton(14), 14);
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
        "caption-lag": "40ms",
        delay: "20ms",
        dir: "1",
        "ease-out": "cubic-bezier(0.25,0.46,0.45,0.94)",
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
        /^godui-calendar-out-to-start var\(--godui-duration-fast\) var\(--godui-calendar-ease-out\) both$/,
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
      // The caption starts --godui-calendar-caption-lag later and runs that
      // much shorter: same end.
      expect(token("godui-calendar-caption-in-from-end")).toContain(
        "calc(var(--godui-duration-base) - var(--godui-calendar-caption-lag) * var(--godui-motion)) var(--ease-spring-snappy) calc((var(--godui-calendar-delay) + var(--godui-calendar-caption-lag)) * var(--godui-motion))",
      );
      // Its exit eases on the same curve as the weeks' — written out, since
      // Chrome doesn't resolve var() in a keyframe's timing function.
      const ease = tuning()["ease-out"]?.replace(/,/g, ", ");
      for (const name of [
        "godui-calendar-caption-out-to-start",
        "godui-calendar-caption-out-to-end",
      ]) {
        expect(keyframes(name), name).toContain(
          `animation-timing-function: ${ease};`,
        );
      }
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
      // While it pops, the button keeps the unselected look under it.
      expect(day).toHaveAttribute("data-fill", "moving");
      expect(day.className).not.toContain("bg-primary");
      expect(day.className).not.toContain("text-primary-foreground");
      // The deselected day mounts a layer that animates out: the layer
      // (number included) fades, its ::before fill shrinks. Keyframes,
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

    it("the copy of the number exists only while the layer animates: once it ends, the day reads its number once", async () => {
      const user = userEvent.setup();
      render(<Single ui={Godui} />);
      await user.click(dayButton(20));
      // Mid-animation the copy is there too.
      expect(dayButton(20).textContent).toBe("2020");
      expect(dayButton(14).textContent).toBe("1414");
      // Neither the ::before's animationend nor a stale one drops the layer.
      animationEnd(
        fill(dayButton(14)) as HTMLElement,
        "godui-calendar-fill-shrink",
        "::before",
      );
      animationEnd(
        fill(dayButton(14)) as HTMLElement,
        "godui-calendar-fill-in",
      );
      // A child's (bubbling) animationend doesn't either.
      const child = document.createElement("i");
      fill(dayButton(14))?.append(child);
      animationEnd(child, "godui-calendar-fade-out");
      expect(fill(dayButton(14))).not.toBeNull();
      // The pop ends: the layer comes to rest under the number, copy gone.
      endFill(dayButton(20));
      expectSettledFill(dayButton(20), 20);
      // The ghost ends: an unselected day, one number, no fill.
      endFill(dayButton(14));
      const left = dayButton(14);
      expect(fill(left)).toBeNull();
      expect(left.textContent).toBe("14");
      expect(left).not.toHaveAttribute("data-fill");
      expect(left.className).not.toContain("bg-primary");
    });

    it("a settled selected day keeps its fill under the pointer (no hover overlay)", () => {
      render(<Single ui={Godui} />);
      expect(dayButton(14)).toHaveClass(
        "hover:text-primary-foreground",
        "dark:hover:text-primary-foreground",
        // The overlay would paint over the resting fill (same layer, later).
        "after:hidden",
      );
    });

    describe("if the layer's animation never runs", () => {
      it("(your CSS cancels it, or the day is hidden) the layer settles at once instead of keeping the copy", async () => {
        HTMLElement.prototype.getAnimations = () => [];
        const user = userEvent.setup();
        render(<Single ui={Godui} />);
        await user.click(dayButton(20));
        // No animationend was fired.
        expectSettledFill(dayButton(20), 20);
        expect(fill(dayButton(14))).toBeNull();
        expect(dayButton(14).textContent).toBe("14");
      });

      it("without getAnimations (jsdom, no polyfill) the layer settles at once: the day reads its number once", async () => {
        const proto = Element.prototype as Partial<Element>;
        const polyfill = proto.getAnimations;
        delete (HTMLElement.prototype as Partial<HTMLElement>).getAnimations;
        delete proto.getAnimations;
        try {
          const user = userEvent.setup();
          render(<Single ui={Godui} />);
          expect(typeof document.body.getAnimations).toBe("undefined");
          await user.click(dayButton(20));
          // No animationend ever fires here.
          expect(dayButton(20).textContent).toBe("20");
          expectSettledFill(dayButton(20), 20);
          expect(dayButton(14).textContent).toBe("14");
          expect(fill(dayButton(14))).toBeNull();
        } finally {
          if (polyfill) proto.getAnimations = polyfill;
        }
      });

      it("while it runs, the layer waits for its animationend", async () => {
        HTMLElement.prototype.getAnimations = () => [{} as Animation];
        const user = userEvent.setup();
        render(<Single ui={Godui} />);
        await user.click(dayButton(20));
        expect(dayButton(20)).toHaveAttribute("data-fill", "moving");
        expect(dayButton(20).textContent).toBe("2020");
      });
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
      expectSettledFill(dayButton(14), 14);
      await user.click(screen.getByRole("button", { name: /next month/i }));
      finishMonthChange();
      await user.click(screen.getByRole("button", { name: /previous month/i }));
      expectSettledFill(dayButton(14), 14);
      expect(document.querySelector("[data-animate]")).toBeNull();
    });

    it("mount rule: a controlled remount (a new key) with a selected day doesn't pop", () => {
      const onSelect = () => {};
      const view = (key: string) => (
        <Godui.Calendar
          key={key}
          mode="single"
          defaultMonth={OCT}
          selected={SELECTED}
          onSelect={onSelect}
        />
      );
      const { rerender } = render(view("a"));
      const before = dayButton(14);
      rerender(view("b"));
      // A fresh grid, not the same element...
      expect(dayButton(14)).not.toBe(before);
      // ...painting its selection at rest.
      expectSettledFill(dayButton(14), 14);
      expect(document.querySelector("[data-animate]")).toBeNull();
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
      expectSettledFill(dayButton(14), 14);
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

    it("RTL: each sweep direction carries its mirrored origin, which dir=rtl selects", async () => {
      const user = userEvent.setup();
      render(<Range ui={Godui} dir="rtl" />);
      // The `rtl:` variant matches under the root's dir attribute.
      expect(root()).toHaveAttribute("dir", "rtl");
      await user.click(dayButton(5, 10));
      // Forward (toward later days, leftward in RTL): grows from the right.
      const forward = startHalf(dayButton(5, 10));
      expect(forward).toHaveAttribute("data-sweep", "forward");
      expect(forward).toHaveClass("origin-left", "rtl:origin-right");
      expect(forward?.className).not.toContain("rtl:origin-left");
      await user.click(dayButton(8));
      // Backward (rightward in RTL): grows from the left.
      const backward = endHalf(dayButton(8));
      expect(backward).toHaveAttribute("data-sweep", "backward");
      expect(backward).toHaveClass("origin-right", "rtl:origin-left");
      expect(backward?.className).not.toContain("rtl:origin-right");
      expect(tuning("rtl:").dir).toBe("-1");
      // The Chrome trace checks the computed transform-origin.
    });

    it("a range end moving from the second month to the first doesn't pop or sweep", async () => {
      const user = userEvent.setup();
      render(<Range ui={Godui} />);
      await user.click(screen.getByRole("button", { name: /next month/i }));
      expect(caption()).toHaveTextContent("November 2026");
      const end = dayButton(3, 10);
      expect(end).toHaveAttribute("data-range-end", "true");
      expectSettledFill(end, 3);
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

    it("a keyboard month change snaps the ring onto the new month's day", async () => {
      const user = userEvent.setup();
      render(<Single ui={Godui} />);
      dayButton(14).focus();
      await user.keyboard("{PageDown}");
      const moved = dayButton(14, 10);
      expect(moved).toHaveFocus();
      expect(moved).toHaveAttribute("data-focus-ring", "snap");
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
          "calc((var(--godui-calendar-delay) + var(--godui-calendar-caption-lag)) * var(--godui-motion))",
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
      expect(entry.css[`@keyframes ${name}`], name).toEqual(
        keyframeObject(name),
      );
    }
    // Not in the shared theme entry.
    const godTheme = registry.items.find(
      (i: { name: string }) => i.name === "godui-theme",
    );
    expect(JSON.stringify(godTheme ?? {})).not.toContain("godui-calendar");
  });
});
