import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Direction } from "radix-ui";
import type * as React from "react";
import { renderToString } from "react-dom/server";
import { expectSlotParity, slotTree } from "../../test/parity";
import * as Shadcn from "../../test/shadcn/slider";
import * as Godui from "./slider";

function Usage({ ui }: { ui: typeof Shadcn }) {
  const { Slider } = ui;
  return (
    <div>
      <Slider defaultValue={[50]} max={100} step={1} aria-label="Volume" />
      <Slider defaultValue={[25, 75]} max={100} step={5} aria-label="Range" />
    </div>
  );
}

// ── A fake layout ────────────────────────────────────────────────────────────
// jsdom has none. The slider is LEN px long (16px across), its thumbs 16px.
// Radix positions each thumb's wrapper with an inline `left` (`bottom` when
// vertical) of `calc(P% + Opx)` and centers it with translate(±50%); the range
// is drawn from the vars the component writes on the track. A running (fake)
// animation draws its element at `progress` between its two keyframes.
const LEN = 320;
const THUMB = 16;

type Fake = {
  el: Element;
  keyframes: Keyframe[];
  options: KeyframeAnimationOptions;
  progress: number;
  cancel: ReturnType<typeof vi.fn>;
  cancelled: boolean;
  onfinish: null;
  finished: Promise<never>;
};
let animations: Fake[];
const running = new Map<Element, Fake>();

/** Numbers in a CSS value: "-3.04px 0px" → [-3.04, 0]. */
const nums = (value: unknown) =>
  String(value ?? "")
    .split(/\s+/)
    .map((n) => Number.parseFloat(n) || 0);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** A running fake's current value of `prop` (each axis interpolated). */
function current(fake: Fake, prop: "translate" | "scale"): number[] {
  const a = nums(fake.keyframes[0][prop]);
  const b = nums(fake.keyframes[1][prop]);
  return a.map((n, i) => lerp(n, b[i] ?? 0, fake.progress));
}

const isVertical = (el: Element) =>
  el.closest('[data-slot="slider"]')?.getAttribute("data-orientation") ===
  "vertical";
/**
 * Radix's thumb position: `calc(P% + Opx)` from the start edge, where O keeps
 * the thumb inside the track. (jsdom drops `calc(… + -1px)` from inline
 * styles, so it's recomputed from the thumb's aria values.)
 */
function thumbOffset(thumb: Element): number {
  const now = thumb.getAttribute("aria-valuenow");
  const min = Number(thumb.getAttribute("aria-valuemin") ?? 0);
  const max = Number(thumb.getAttribute("aria-valuemax") ?? 100);
  const p = now === null ? 0 : ((Number(now) - min) / (max - min)) * 100;
  return (p / 100) * LEN + THUMB / 2 - (p / 50) * (THUMB / 2);
}
function rect(left: number, top: number, width: number, height: number) {
  return {
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
  } as DOMRect;
}
function wrapperRect(wrapper: HTMLElement): DOMRect {
  const thumb = wrapper.firstElementChild as Element;
  const at = thumbOffset(thumb);
  if (isVertical(wrapper)) {
    return rect(0, LEN - at - THUMB / 2, THUMB, THUMB);
  }
  return rect(at - THUMB / 2, 0, THUMB, THUMB);
}
function fakeRect(this: Element): DOMRect {
  const slot = this.getAttribute("data-slot");
  const vertical = isVertical(this);
  if (slot === "slider" || slot === "slider-track") {
    return vertical ? rect(0, 0, THUMB, LEN) : rect(0, 0, LEN, THUMB);
  }
  if (slot === "slider-thumb") {
    const base = wrapperRect(this.parentElement as HTMLElement);
    const fake = running.get(this);
    const [dx, dy] = fake ? current(fake, "translate") : [0, 0];
    return rect(base.left + dx, base.top + dy, THUMB, THUMB);
  }
  if (slot === "slider-range") {
    const fake = running.get(this);
    let start: number;
    let size: number;
    if (fake) {
      const [tx, ty] = current(fake, "translate");
      const [sx, sy] = current(fake, "scale");
      start = (vertical ? ty : tx) / 100;
      size = vertical ? sy : sx;
    } else {
      const track = this.parentElement as HTMLElement;
      start = Number(
        track.style.getPropertyValue("--godui-slider-range-start") || 0,
      );
      size = Number(
        track.style.getPropertyValue("--godui-slider-range-size") || 1,
      );
    }
    return vertical
      ? rect(0, start * LEN, THUMB, size * LEN)
      : rect(start * LEN, 0, size * LEN, THUMB);
  }
  if (this.firstElementChild?.getAttribute("data-slot") === "slider-thumb") {
    return wrapperRect(this as HTMLElement);
  }
  return rect(0, 0, 0, 0);
}
function fakeSize(axis: "width" | "height") {
  return function (this: HTMLElement) {
    const slot = this.getAttribute("data-slot");
    if (slot === "slider-thumb") return THUMB;
    if (slot === "slider" || slot === "slider-track") {
      return (axis === "width") === !isVertical(this) ? LEN : THUMB;
    }
    return 0;
  };
}

class FakePointerEvent extends MouseEvent {
  pointerId: number;
  constructor(type: string, init: PointerEventInit = {}) {
    super(type, init);
    this.pointerId = init.pointerId ?? 1;
  }
}

const saved: Array<() => void> = [];
function patch<T extends object, K extends keyof T>(
  target: T,
  key: K,
  value: unknown,
) {
  const had = Object.getOwnPropertyDescriptor(target, key);
  Object.defineProperty(target, key, {
    configurable: true,
    writable: true,
    value,
  });
  saved.push(() => {
    if (had) Object.defineProperty(target, key, had);
    else delete (target as Record<K, unknown>)[key];
  });
}
function patchGetter<T extends object>(
  target: T,
  key: string,
  get: () => unknown,
) {
  const had = Object.getOwnPropertyDescriptor(target, key);
  Object.defineProperty(target, key, { configurable: true, get });
  saved.push(() => {
    if (had) Object.defineProperty(target, key, had);
  });
}

let tokens: HTMLStyleElement;
beforeEach(() => {
  animations = [];
  running.clear();
  patch(Element.prototype, "getBoundingClientRect", fakeRect);
  patchGetter(HTMLElement.prototype, "offsetWidth", fakeSize("width"));
  patchGetter(HTMLElement.prototype, "offsetHeight", fakeSize("height"));
  patchGetter(HTMLElement.prototype, "offsetLeft", () => 0);
  patchGetter(HTMLElement.prototype, "offsetTop", () => 0);
  patch(Element.prototype, "setPointerCapture", () => {});
  patch(Element.prototype, "releasePointerCapture", () => {});
  patch(Element.prototype, "hasPointerCapture", () => true);
  patch(window, "PointerEvent", FakePointerEvent);
  patch(
    Element.prototype,
    "animate",
    function (
      this: Element,
      keyframes: Keyframe[],
      options: KeyframeAnimationOptions,
    ) {
      const fake: Fake = {
        el: this,
        keyframes,
        options,
        progress: 0,
        cancelled: false,
        cancel: vi.fn(() => {
          fake.cancelled = true;
          if (running.get(this) === fake) running.delete(this);
        }),
        onfinish: null,
        finished: new Promise<never>(() => {}),
      };
      running.set(this, fake);
      animations.push(fake);
      return fake;
    },
  );
  // The motion tokens the glide reads (jsdom doesn't load styles.css).
  tokens = document.createElement("style");
  tokens.textContent = `[data-slot="slider"] {
    --godui-duration-fast: 150ms; --godui-duration-base: 260ms;
    --ease-out-expo: test-expo; --ease-spring-snappy: test-snappy;
  }`;
  document.head.append(tokens);
});

afterEach(() => {
  tokens.remove();
  for (const undo of saved.reverse()) undo();
  saved.length = 0;
});

function reducedMotion() {
  const original = window.matchMedia;
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes("reduce"),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  saved.push(() => {
    window.matchMedia = original;
  });
}

const rootOf = (i = 0) =>
  document.querySelectorAll<HTMLElement>('[data-slot="slider"]')[i];
const trackOf = (i = 0) =>
  rootOf(i).querySelector<HTMLElement>(
    '[data-slot="slider-track"]',
  ) as HTMLElement;
const rangeOf = (i = 0) =>
  rootOf(i).querySelector<HTMLElement>(
    '[data-slot="slider-range"]',
  ) as HTMLElement;
const thumbsOf = (i = 0) => [
  ...rootOf(i).querySelectorAll<HTMLElement>('[data-slot="slider-thumb"]'),
];
const vars = (i = 0) => ({
  start: Number(
    trackOf(i).style.getPropertyValue("--godui-slider-range-start"),
  ),
  size: Number(trackOf(i).style.getPropertyValue("--godui-slider-range-size")),
});
const glidesOf = (el: Element) => animations.filter((a) => a.el === el);
const lastGlide = (el: Element) => glidesOf(el).at(-1);
/** Let a microtask (the MutationObserver) and a task (flag resets) run. */
const settle = () => act(() => new Promise((r) => setTimeout(r, 0)));
/**
 * Render and let the first-paint records land, as they do in a browser
 * before any input can arrive.
 */
async function mount(ui: React.ReactElement) {
  const result = render(ui);
  await settle();
  return result;
}

describe("Slider", () => {
  it("matches shadcn's data-slot tree (one thumb per value) and exports", () => {
    const { unmount } = render(<Usage ui={Shadcn} />);
    const expected = slotTree();
    unmount();
    render(<Usage ui={Godui} />);
    expectSlotParity(slotTree(), expected);
    expect(
      document.querySelectorAll('[data-slot="slider-thumb"]'),
    ).toHaveLength(3);
    expect(Object.keys(Godui)).toEqual(
      expect.arrayContaining(Object.keys(Shadcn)),
    );
  });

  it("steps with the arrow keys", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    const thumb = screen.getAllByRole("slider")[0];
    thumb.focus();
    await user.keyboard("{ArrowRight}");
    expect(thumb).toHaveAttribute("aria-valuenow", "51");
  });

  describe("press", () => {
    it("marks the root pressed on pointerdown, dragging only past 3px, and clears both on release", async () => {
      render(<Godui.Slider defaultValue={[50]} aria-label="Volume" />);
      const root = rootOf();
      fireEvent.pointerDown(trackOf(), { clientX: 100, clientY: 8 });
      expect(root).toHaveAttribute("data-pressed");
      expect(root).not.toHaveAttribute("data-dragging");
      fireEvent.pointerMove(trackOf(), { clientX: 102, clientY: 8 });
      expect(root).not.toHaveAttribute("data-dragging");
      fireEvent.pointerMove(trackOf(), { clientX: 104, clientY: 8 });
      expect(root).toHaveAttribute("data-dragging");
      fireEvent.pointerUp(trackOf(), { clientX: 104, clientY: 8 });
      expect(root).not.toHaveAttribute("data-pressed");
      expect(root).not.toHaveAttribute("data-dragging");
      await settle();
    });

    it("clears the press on pointercancel too", () => {
      render(<Godui.Slider defaultValue={[50]} aria-label="Volume" />);
      fireEvent.pointerDown(thumbsOf()[0], { clientX: 160 });
      fireEvent.pointerMove(thumbsOf()[0], { clientX: 170 });
      fireEvent.pointerCancel(thumbsOf()[0]);
      expect(rootOf()).not.toHaveAttribute("data-pressed");
      expect(rootOf()).not.toHaveAttribute("data-dragging");
    });

    it("the keyboard never presses", async () => {
      const user = userEvent.setup();
      render(<Godui.Slider defaultValue={[50]} aria-label="Volume" />);
      thumbsOf()[0].focus();
      await user.keyboard("{ArrowRight}{End}");
      expect(rootOf()).not.toHaveAttribute("data-pressed");
      expect(rootOf()).not.toHaveAttribute("data-dragging");
    });

    it("lifts the thumb a track press moves (the closest one), not only one held under the pointer", async () => {
      render(<Godui.Slider defaultValue={[20, 80]} aria-label="Range" />);
      const [low, high] = thumbsOf();
      fireEvent.pointerDown(trackOf(), { clientX: 250 });
      expect(high).toHaveAttribute("data-active");
      expect(low).not.toHaveAttribute("data-active");
      expect(high.className).toContain(
        "motion-safe:group-data-[pressed]/slider:data-[active]:scale-[1.15]",
      );
      expect(high.className).not.toContain("active:scale");
      fireEvent.pointerUp(trackOf(), { clientX: 250 });
      expect(high).not.toHaveAttribute("data-active");
      await settle();
    });

    it("thickens the track while pressed: scaleY (scaleX vertical) on a snappy spring", () => {
      render(<Godui.Slider defaultValue={[50]} aria-label="Volume" />);
      const cls = trackOf().className;
      expect(cls).toContain(
        "motion-safe:group-data-[pressed]/slider:data-[orientation=horizontal]:scale-y-150",
      );
      expect(cls).toContain(
        "motion-safe:group-data-[pressed]/slider:data-[orientation=vertical]:scale-x-150",
      );
      expect(cls).toContain(
        "[transition:scale_var(--godui-duration-fast)_var(--ease-spring-snappy)",
      );
      expect(rootOf().className).toContain("group/slider");
    });
  });

  describe("halo", () => {
    it("fades and grows a ::before halo in on hover/focus instead of a box-shadow ring", () => {
      render(<Godui.Slider defaultValue={[50]} aria-label="Volume" />);
      const cls = thumbsOf()[0].className;
      for (const c of [
        "before:-inset-1",
        "before:bg-ring/50",
        "before:opacity-0",
        "before:scale-60",
        "before:transition-[opacity,scale]",
        "before:ease-out-expo",
        "hover:before:opacity-100",
        "focus-visible:before:opacity-100",
        "motion-reduce:before:scale-100",
      ]) {
        expect(cls).toContain(c);
      }
      expect(cls).not.toMatch(/(^|\s)(hover|focus-visible):ring-4/);
      expect(cls).not.toContain("transition-[color");
    });
  });

  describe("range transform", () => {
    const cases: Array<{
      name: string;
      props: React.ComponentProps<typeof Godui.Slider>;
      next: number[];
      expected: [number, number];
      after: [number, number];
      rtl?: boolean;
    }> = [
      {
        name: "horizontal",
        props: {},
        next: [70],
        expected: [0, 0.3],
        after: [0, 0.7],
      },
      {
        name: "two thumbs",
        props: {},
        next: [10, 60],
        expected: [0.3, 0.3],
        after: [0.1, 0.5],
      },
      {
        name: "inverted",
        props: { inverted: true },
        next: [70],
        expected: [0.7, 0.3],
        after: [0.3, 0.7],
      },
      {
        name: "RTL",
        props: { dir: "rtl" },
        next: [70],
        expected: [0.7, 0.3],
        after: [0.3, 0.7],
      },
      {
        name: "RTL from a DirectionProvider",
        props: {},
        rtl: true,
        next: [70],
        expected: [0.7, 0.3],
        after: [0.3, 0.7],
      },
      {
        name: "RTL + inverted",
        props: { dir: "rtl", inverted: true },
        next: [70],
        expected: [0, 0.3],
        after: [0, 0.7],
      },
      {
        name: "vertical (grows up from the bottom)",
        props: { orientation: "vertical" },
        next: [70],
        expected: [0.7, 0.3],
        after: [0.3, 0.7],
      },
      {
        name: "vertical inverted",
        props: { orientation: "vertical", inverted: true },
        next: [70],
        expected: [0, 0.3],
        after: [0, 0.7],
      },
      {
        name: "vertical two thumbs",
        props: { orientation: "vertical" },
        next: [10, 60],
        expected: [0.4, 0.3],
        after: [0.4, 0.5],
      },
    ];
    for (const c of cases) {
      it(`${c.name}: full-length range placed by translate + scale from Radix's own start/end`, async () => {
        const first = c.next.length > 1 ? [30, 60] : [30];
        const ui = (value: number[]) => {
          const slider = (
            <Godui.Slider value={value} aria-label="Value" {...c.props} />
          );
          return c.rtl ? (
            <Direction.Provider dir="rtl">{slider}</Direction.Provider>
          ) : (
            slider
          );
        };
        // Server render: the vars ship in the HTML, so there's no flash.
        const html = renderToString(ui(first));
        expect(html).toContain(
          `--godui-slider-range-start:${c.expected[0]};--godui-slider-range-size:${c.expected[1]}`,
        );
        const { rerender } = render(ui(first));
        expect(vars()).toEqual({ start: c.expected[0], size: c.expected[1] });
        // A controlled change: read back from Radix's inline left/right.
        rerender(ui(c.next));
        await settle();
        expect(vars().start).toBeCloseTo(c.after[0], 6);
        expect(vars().size).toBeCloseTo(c.after[1], 6);
        const cls = rangeOf().className;
        expect(cls).toContain("inset-0!");
        expect(cls).toContain("origin-top-left");
      });
    }
  });

  describe("glide", () => {
    it("doesn't animate on first paint", async () => {
      await mount(<Usage ui={Godui} />);
      await settle();
      expect(animations).toHaveLength(0);
    });

    it("an arrow key glides thumb and range on one fast ease-out-expo clock", async () => {
      const user = userEvent.setup();
      await mount(<Godui.Slider defaultValue={[50]} aria-label="Volume" />);
      const [thumb] = thumbsOf();
      thumb.focus();
      await user.keyboard("{ArrowRight}");
      await settle();
      const t = lastGlide(thumb);
      const r = lastGlide(rangeOf());
      expect(t && r).toBeTruthy();
      // From where it was drawn (1% of LEN - THUMB = 3.04px back) to rest.
      expect(nums(t?.keyframes[0].translate)[0]).toBeCloseTo(-3.04, 6);
      expect(t?.keyframes[1].translate).toBe("0px 0px");
      expect(r?.keyframes[0]).toEqual({ translate: "0% 0px", scale: "0.5 1" });
      expect(r?.keyframes[1]).toEqual({ translate: "0% 0px", scale: "0.51 1" });
      expect(t?.options).toEqual({ duration: 150, easing: "test-expo" });
      expect(r?.options).toEqual(t?.options);
    });

    it("Home / End / Page keys glide on the base snappy spring", async () => {
      const user = userEvent.setup();
      await mount(<Godui.Slider defaultValue={[50]} aria-label="Volume" />);
      const [thumb] = thumbsOf();
      thumb.focus();
      await user.keyboard("{End}");
      await settle();
      expect(lastGlide(thumb)?.options).toEqual({
        duration: 260,
        easing: "test-snappy",
      });
      expect(nums(lastGlide(thumb)?.keyframes[0].translate)[0]).toBeCloseTo(
        -152,
        6,
      );
      expect(lastGlide(rangeOf())?.options).toEqual(lastGlide(thumb)?.options);
    });

    it("a click on the track glides the thumb there on the base snappy spring", async () => {
      await mount(<Godui.Slider defaultValue={[50]} aria-label="Volume" />);
      const [thumb] = thumbsOf();
      fireEvent.pointerDown(trackOf(), { clientX: 240 });
      await settle();
      expect(thumb).toHaveAttribute("aria-valuenow", "75");
      expect(lastGlide(thumb)?.options).toEqual({
        duration: 260,
        easing: "test-snappy",
      });
      // 25% of (LEN - THUMB) back.
      expect(nums(lastGlide(thumb)?.keyframes[0].translate)[0]).toBeCloseTo(
        -76,
        6,
      );
      expect(lastGlide(rangeOf())?.keyframes).toEqual([
        { translate: "0% 0px", scale: "0.5 1" },
        { translate: "0% 0px", scale: "0.75 1" },
      ]);
      fireEvent.pointerUp(trackOf(), { clientX: 240 });
    });

    it("a new controlled value glides like a click; vertical glides on y", async () => {
      const { rerender } = await mount(
        <Godui.Slider value={[50]} orientation="vertical" aria-label="V" />,
      );
      rerender(
        <Godui.Slider value={[75]} orientation="vertical" aria-label="V" />,
      );
      await settle();
      const [thumb] = thumbsOf();
      const t = lastGlide(thumb);
      expect(t?.options).toEqual({ duration: 260, easing: "test-snappy" });
      // Up is negative y, so the thumb starts 76px below where it lands.
      const [dx, dy] = nums(t?.keyframes[0].translate);
      expect(dx).toBe(0);
      expect(dy).toBeCloseTo(76, 6);
      expect(lastGlide(rangeOf())?.keyframes).toEqual([
        { translate: "0px 50%", scale: "1 0.5" },
        { translate: "0px 25%", scale: "1 0.75" },
      ]);
    });

    it("an interrupted glide carries on from where thumb and range are drawn", async () => {
      const user = userEvent.setup();
      await mount(<Godui.Slider defaultValue={[50]} aria-label="Volume" />);
      const [thumb] = thumbsOf();
      thumb.focus();
      await user.keyboard("{ArrowRight}");
      await settle();
      const first = lastGlide(thumb) as Fake;
      const firstRange = lastGlide(rangeOf()) as Fake;
      first.progress = 0.5;
      firstRange.progress = 0.5;
      await user.keyboard("{ArrowRight}");
      await settle();
      expect(first.cancel).toHaveBeenCalled();
      expect(firstRange.cancel).toHaveBeenCalled();
      // Drawn halfway (1.52px short of 51) → 52 is 3.04 further: 4.56px back.
      expect(nums(lastGlide(thumb)?.keyframes[0].translate)[0]).toBeCloseTo(
        -4.56,
        6,
      );
      const range = lastGlide(rangeOf());
      expect(nums(range?.keyframes[0].scale)[0]).toBeCloseTo(0.505, 6);
      expect(range?.keyframes[1]).toEqual({
        translate: "0% 0px",
        scale: "0.52 1",
      });
    });

    it("a second thumb still gliding is retimed onto the new clock", async () => {
      const user = userEvent.setup();
      await mount(<Godui.Slider defaultValue={[20, 80]} aria-label="Range" />);
      const [low, high] = thumbsOf();
      low.focus();
      await user.keyboard("{Home}");
      await settle();
      expect(lastGlide(low)).toBeTruthy();
      (lastGlide(low) as Fake).progress = 0.5;
      high.focus();
      await user.keyboard("{ArrowRight}");
      await settle();
      expect(lastGlide(high)?.options).toEqual(lastGlide(low)?.options);
      expect(glidesOf(low)).toHaveLength(2);
    });

    it("never glides while dragging: the thumb is the pointer's", async () => {
      await mount(<Godui.Slider defaultValue={[50]} aria-label="Volume" />);
      const [thumb] = thumbsOf();
      // Each move is its own task in a browser; the observer runs between.
      fireEvent.pointerDown(thumb, { clientX: 160 });
      for (const x of [170, 180, 190]) {
        fireEvent.pointerMove(thumb, { clientX: x });
        await settle();
      }
      expect(Number(thumb.getAttribute("aria-valuenow"))).toBeGreaterThan(50);
      expect(animations).toHaveLength(0);
      fireEvent.pointerUp(thumb, { clientX: 190 });
    });

    it("a sub-slop wobble on a held thumb snaps (no lag), it doesn't glide", async () => {
      await mount(<Godui.Slider defaultValue={[50]} aria-label="Volume" />);
      const [thumb] = thumbsOf();
      fireEvent.pointerDown(thumb, { clientX: 160 });
      await settle();
      fireEvent.pointerMove(thumb, { clientX: 162 });
      await settle();
      expect(thumb).toHaveAttribute("aria-valuenow", "51");
      expect(animations).toHaveLength(0);
      fireEvent.pointerUp(thumb, { clientX: 162 });
    });

    it("a track press that turns into a drag drops its glide", async () => {
      await mount(<Godui.Slider defaultValue={[50]} aria-label="Volume" />);
      const [thumb] = thumbsOf();
      fireEvent.pointerDown(trackOf(), { clientX: 240 });
      await settle();
      const glide = lastGlide(thumb) as Fake;
      const range = lastGlide(rangeOf()) as Fake;
      fireEvent.pointerMove(trackOf(), { clientX: 250 });
      await settle();
      expect(glide.cancel).toHaveBeenCalled();
      expect(range.cancel).toHaveBeenCalled();
      expect(glidesOf(thumb)).toHaveLength(1);
      fireEvent.pointerUp(trackOf(), { clientX: 250 });
    });

    it("coarse steps (12px+) glide even mid-drag, on the fast clock", async () => {
      await mount(
        <Godui.Slider defaultValue={[50]} step={25} aria-label="Coarse" />,
      );
      const [thumb] = thumbsOf();
      fireEvent.pointerDown(thumb, { clientX: 160 });
      fireEvent.pointerMove(thumb, { clientX: 240 });
      await settle();
      expect(thumb).toHaveAttribute("aria-valuenow", "75");
      expect(lastGlide(thumb)?.options).toEqual({
        duration: 150,
        easing: "test-expo",
      });
      fireEvent.pointerUp(thumb, { clientX: 240 });
    });

    it("reduced motion: values snap, nothing glides", async () => {
      reducedMotion();
      const user = userEvent.setup();
      await mount(<Godui.Slider defaultValue={[50]} aria-label="Volume" />);
      thumbsOf()[0].focus();
      await user.keyboard("{ArrowRight}{End}");
      fireEvent.pointerDown(trackOf(), { clientX: 40 });
      await settle();
      expect(animations).toHaveLength(0);
      expect(vars()).toEqual({ start: 0, size: 0.13 });
    });
  });

  describe("overdrag", () => {
    it("stretches the track toward the pointer past an end (sigmoid, capped at 24px) and the end thumb rides it", async () => {
      await mount(<Godui.Slider defaultValue={[90]} aria-label="Volume" />);
      const [thumb] = thumbsOf();
      const track = trackOf();
      fireEvent.pointerDown(thumb, { clientX: 290 });
      fireEvent.pointerMove(thumb, { clientX: 330 });
      await settle();
      expect(thumb).toHaveAttribute("aria-valuenow", "100");
      fireEvent.pointerMove(thumb, { clientX: 344 });
      const stretch = Number(
        track.style.getPropertyValue("--godui-slider-stretch"),
      );
      // 24px past the end → 2(σ(1) − ½)·24 ≈ 11.09px of give.
      const give = 2 * (1 / (1 + Math.exp(-1)) - 0.5) * 24;
      expect(stretch).toBeCloseTo(1 + give / LEN, 4);
      expect(
        Number(track.style.getPropertyValue("--godui-slider-thin")),
      ).toBeCloseTo(1 - (0.2 * give) / 24, 4);
      expect(track.style.getPropertyValue("--godui-slider-origin")).toBe(
        "0% 50%",
      );
      const [ride] = nums(thumb.style.getPropertyValue("--godui-slider-ride"));
      expect(ride).toBeCloseTo((give * (LEN - THUMB / 2)) / LEN, 3);
      // Way past: never more than 24px.
      fireEvent.pointerMove(thumb, { clientX: 2000 });
      expect(
        Number(track.style.getPropertyValue("--godui-slider-stretch")),
      ).toBeLessThanOrEqual(1 + 24 / LEN);
      // Release: the vars go, the CSS transition springs it back.
      fireEvent.pointerUp(thumb, { clientX: 2000 });
      expect(track.style.getPropertyValue("--godui-slider-stretch")).toBe("");
      expect(track.style.getPropertyValue("--godui-slider-thin")).toBe("");
      expect(thumb.style.getPropertyValue("--godui-slider-ride")).toBe("");
      expect(track.className).toContain(
        "transform_var(--godui-duration-slow)_var(--ease-spring-bouncy)",
      );
      expect(track.className).toContain(
        "group-data-[dragging]/slider:[transition:scale_var(--godui-duration-fast)_var(--ease-spring-snappy)]",
      );
    });

    it("stretches from the right end when pulled past the left", async () => {
      await mount(<Godui.Slider defaultValue={[5]} aria-label="Volume" />);
      const [thumb] = thumbsOf();
      fireEvent.pointerDown(thumb, { clientX: 20 });
      fireEvent.pointerMove(thumb, { clientX: -30 });
      expect(trackOf().style.getPropertyValue("--godui-slider-origin")).toBe(
        "100% 50%",
      );
      const [ride] = nums(thumb.style.getPropertyValue("--godui-slider-ride"));
      expect(ride).toBeLessThan(0);
      fireEvent.pointerUp(thumb, { clientX: -30 });
    });

    it("reduced motion: no rubber band", async () => {
      reducedMotion();
      await mount(<Godui.Slider defaultValue={[90]} aria-label="Volume" />);
      const [thumb] = thumbsOf();
      fireEvent.pointerDown(thumb, { clientX: 290 });
      fireEvent.pointerMove(thumb, { clientX: 400 });
      expect(trackOf().style.getPropertyValue("--godui-slider-stretch")).toBe(
        "",
      );
      fireEvent.pointerUp(thumb, { clientX: 400 });
    });
  });

  it("reduced motion: press scale and thicken are motion-safe only; transitions off", async () => {
    await mount(<Godui.Slider defaultValue={[50]} aria-label="Volume" />);
    const thumb = thumbsOf()[0].className;
    const track = trackOf().className;
    expect(thumb).toContain("motion-reduce:transition-none");
    expect(track).toContain("motion-reduce:transition-none");
    expect(thumb).not.toMatch(/(^|\s)group-data-\[pressed\]/);
    expect(track).not.toMatch(/(^|\s)group-data-\[pressed\]/);
  });
});
