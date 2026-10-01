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

function Range({ ui }: { ui: typeof Shadcn }) {
  const { Calendar } = ui;
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(2026, 9, 12),
    to: new Date(2026, 10, 3),
  });
  return (
    <Calendar
      mode="range"
      defaultMonth={OCT}
      selected={range}
      onSelect={setRange}
      numberOfMonths={2}
      className="rounded-lg border shadow-sm"
    />
  );
}

const PKG = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

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
const dayButton = (day: number, month = "October") => {
  const mm = month === "October" ? "10" : "11";
  const iso = `2026-${mm}-${String(day).padStart(2, "0")}`;
  const el = live(`td[data-day="${iso}"]:not([data-outside]) button`);
  if (!el) throw new Error(`no live day ${month} ${day}`);
  return el;
};

/** `--animate-<name>` from styles.css — the duration var it plays for. */
function tokenDuration(name: string): string {
  const css = readFileSync(join(PKG, "styles.css"), "utf8");
  const match = css.match(
    new RegExp(`--animate-${name}:\\s*${name}\\s+(var\\(--[\\w-]+\\))`),
  );
  if (!match?.[1]) throw new Error(`no token for ${name}`);
  return match[1];
}

describe("Calendar", () => {
  it("matches shadcn's data-slot tree and exports (single, selected date)", () => {
    const { unmount } = render(<Single ui={Shadcn} />);
    const expected = slotTree();
    unmount();
    render(<Single ui={Godui} />);
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
    expectSlotParity(slotTree(), expected);
  });

  it("Next changes the caption", async () => {
    const user = userEvent.setup();
    render(<Godui.Calendar defaultMonth={OCT} />);
    expect(caption()).toHaveTextContent("October 2026");
    await user.click(screen.getByRole("button", { name: /next month/i }));
    expect(caption()).toHaveTextContent("November 2026");
  });

  // rdp adds these with classList.add, which throws on a token containing
  // whitespace — inside its layout effect that would unmount the calendar on
  // the first Next. Every test that clicks Next/Previous guards that.
  it("Next: the new weeks slide in from the right, the old month slides out to the left", async () => {
    const user = userEvent.setup();
    render(<Godui.Calendar defaultMonth={OCT} />);
    await user.click(screen.getByRole("button", { name: /next month/i }));
    expect(liveWeeks()?.className).toContain(
      "animate-godui-slide-in-from-right",
    );
    expect(caption()?.className).toContain("animate-godui-fade-in");
    const old = oldMonth();
    expect(old).not.toBeNull();
    expect(old).toHaveTextContent("October 2026");
    expect(old?.querySelector("[data-animated-weeks]")?.className).toContain(
      "animate-godui-slide-out-to-left",
    );
    expect(old?.querySelector("[data-animated-caption]")?.className).toContain(
      "godui-fade-out",
    );
  });

  it("Previous: the new weeks slide in from the left, the old month slides out to the right", async () => {
    const user = userEvent.setup();
    render(<Godui.Calendar defaultMonth={OCT} />);
    await user.click(screen.getByRole("button", { name: /previous month/i }));
    expect(caption()).toHaveTextContent("September 2026");
    expect(liveWeeks()?.className).toContain(
      "animate-godui-slide-in-from-left",
    );
    expect(
      oldMonth()?.querySelector("[data-animated-weeks]")?.className,
    ).toContain("animate-godui-slide-out-to-right");
  });

  it("slides a whole month width, mirrored in RTL", () => {
    render(<Godui.Calendar defaultMonth={OCT} />);
    const cls = liveWeeks()?.className ?? "";
    expect(cls).toContain("[--godui-enter-distance:100%]");
    expect(cls).toContain("rtl:[--godui-enter-distance:-100%]");
  });

  it("caption exit lasts as long as the weeks exit and enter (rdp drops the old month on its animationend)", async () => {
    const user = userEvent.setup();
    render(<Godui.Calendar defaultMonth={OCT} />);
    await user.click(screen.getByRole("button", { name: /next month/i }));
    const exit =
      oldMonth()?.querySelector("[data-animated-caption]")?.className ?? "";
    const weeks = liveWeeks()?.className ?? "";
    // The tokens: fade-out is fast, the slide out is base, the slide in slow.
    expect(tokenDuration("godui-fade-out")).toBe("var(--godui-duration-fast)");
    expect(tokenDuration("godui-slide-out-to-left")).toBe(
      "var(--godui-duration-base)",
    );
    expect(tokenDuration("godui-slide-in-from-right")).toBe(
      "var(--godui-duration-slow)",
    );
    // The caption's fade-out is stretched to base...
    expect(exit).toContain("animate-godui-fade-out");
    expect(exit).toContain(
      "[--godui-duration-fast:var(--godui-duration-base)]",
    );
    // ...and the weeks' slide in shortened to base: the cleanup (which also
    // strips the enter class) never cuts a slide short.
    expect(weeks).toContain(
      "[--godui-duration-slow:var(--godui-duration-base)]",
    );
  });

  it("the old and new weeks share one curve, so they slide as one strip", async () => {
    const user = userEvent.setup();
    render(<Godui.Calendar defaultMonth={OCT} />);
    await user.click(screen.getByRole("button", { name: /next month/i }));
    // The tokens differ: the slide in springs, the slide out is expo.
    const css = readFileSync(join(PKG, "styles.css"), "utf8");
    expect(css).toMatch(
      /--animate-godui-slide-in-from-right:[^;]*var\(--ease-spring-smooth\)/,
    );
    expect(css).toMatch(
      /--animate-godui-slide-out-to-left:[^;]*var\(--ease-out-expo\)/,
    );
    // Both weeks elements (live and rdp's clone) redefine the exit's curve as
    // the enter's, or a gap opens between the months mid-slide.
    const oldWeeks = oldMonth()?.querySelector("[data-animated-weeks]");
    for (const weeks of [liveWeeks(), oldWeeks]) {
      expect(weeks?.className).toContain(
        "[--ease-out-expo:var(--ease-spring-smooth)]",
      );
    }
  });

  it("removes the old month only on the old caption's animationend", async () => {
    const user = userEvent.setup();
    render(<Godui.Calendar defaultMonth={OCT} />);
    await user.click(screen.getByRole("button", { name: /next month/i }));
    // A second click mid-slide is skipped by rdp; the old month stays.
    await user.click(screen.getByRole("button", { name: /next month/i }));
    const old = oldMonth();
    expect(old).not.toBeNull();
    const oldCaption = old?.querySelector("[data-animated-caption]");
    if (!oldCaption) throw new Error("no old caption");
    fireEvent.animationEnd(oldCaption);
    expect(oldMonth()).toBeNull();
    expect(liveWeeks()?.className).not.toContain("animate-godui-slide-in");
  });

  it("animate={false} opts out of the month slide", async () => {
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
    expect(liveWeeks()?.className).not.toContain("slide-in-from-right");
  });

  it("selected day does not pop on mount or month change", async () => {
    const user = userEvent.setup();
    render(<Single ui={Godui} />);
    expect(dayButton(14)).not.toHaveAttribute("data-animate");
    await user.click(screen.getByRole("button", { name: /next month/i }));
    const oldCaption = oldMonth()?.querySelector("[data-animated-caption]");
    if (oldCaption) fireEvent.animationEnd(oldCaption);
    await user.click(screen.getByRole("button", { name: /previous month/i }));
    expect(dayButton(14)).not.toHaveAttribute("data-animate");
  });

  it("clicking a day pops it", async () => {
    const user = userEvent.setup();
    render(<Single ui={Godui} />);
    await user.click(dayButton(20));
    const day = dayButton(20);
    expect(day).toHaveAttribute("data-selected-single", "true");
    expect(day).toHaveAttribute("data-animate", "true");
    expect(day.className).toContain("animate-godui-pop");
    expect(day.className).toContain("[--godui-pop-scale:0.88]");
    // The Button's press scale would be a second `scale` animation on the
    // same element (Chrome then composites neither): the pop replaces it.
    expect(day.className).toContain("active:scale-none");
    expect(day.className).not.toContain("active:scale-[0.97]");
    // Deselected: no pop on the way out.
    expect(dayButton(14)).not.toHaveAttribute("data-animate");
  });

  it("controlled selection changes pop too", () => {
    const onSelect = () => {};
    const { rerender } = render(
      <Godui.Calendar
        mode="single"
        defaultMonth={OCT}
        selected={SELECTED}
        onSelect={onSelect}
      />,
    );
    expect(dayButton(14)).not.toHaveAttribute("data-animate");
    rerender(
      <Godui.Calendar
        mode="single"
        defaultMonth={OCT}
        selected={new Date(2026, 9, 21)}
        onSelect={onSelect}
      />,
    );
    expect(dayButton(21)).toHaveAttribute("data-animate", "true");
  });

  it("the range middle snaps; only the ends pop", async () => {
    const user = userEvent.setup();
    render(<Range ui={Godui} />);
    await user.click(dayButton(5, "November"));
    const end = dayButton(5, "November");
    expect(end).toHaveAttribute("data-range-end", "true");
    const middle = dayButton(4, "November");
    expect(middle).toHaveAttribute("data-range-middle", "true");
    // The fill spreads across the middle without a pop.
    expect(middle).not.toHaveAttribute("data-animate");
    expect(end).toHaveAttribute("data-animate", "true");
  });

  it("the exiting clone of a just-popped day does not replay the pop", () => {
    render(<Godui.Calendar mode="single" defaultMonth={OCT} />);
    expect(dayButton(14).className).toContain(
      "not-in-[[data-animated-month][aria-hidden=true]]:",
    );
  });

  it("reduced motion: the month slide and the day pop scale by --godui-motion (0 under the preference)", () => {
    const css = readFileSync(join(PKG, "styles.css"), "utf8");
    for (const name of [
      "godui-slide-in-from-left",
      "godui-slide-in-from-right",
      "godui-slide-out-to-left",
      "godui-slide-out-to-right",
      "godui-pop",
    ]) {
      const block = css.match(
        new RegExp(`@keyframes ${name} \\{[^}]*\\}`),
      )?.[0];
      expect(block, name).toContain("var(--godui-motion)");
    }
  });
});
