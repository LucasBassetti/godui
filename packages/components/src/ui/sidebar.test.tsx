import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { act, fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectSlotParity, slotTree } from "../../test/parity";
import * as Shadcn from "../../test/shadcn/sidebar";
import * as Godui from "./sidebar";

type Collapsible = "offcanvas" | "icon" | "none";

// shadcn's sidebar-07 shape: header, groups with a label, action, menu with
// badge/action/sub, footer, rail, and the inset with its trigger.
function Usage({
  ui,
  collapsible = "icon",
  variant,
  side,
  className,
}: {
  ui: typeof Shadcn;
  collapsible?: Collapsible;
  variant?: "sidebar" | "floating" | "inset";
  side?: "left" | "right";
  className?: string;
}) {
  const {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInput,
    SidebarInset,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSkeleton,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarRail,
    SidebarSeparator,
    SidebarTrigger,
  } = ui;
  return (
    <SidebarProvider>
      <Sidebar
        collapsible={collapsible}
        variant={variant}
        side={side}
        className={className}
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <span>A</span>
                <span>Acme Inc</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarInput placeholder="Search" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarGroupAction title="Add project">+</SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Playground" isActive>
                    <span>Playground</span>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>24</SidebarMenuBadge>
                  <SidebarMenuAction showOnHover>…</SidebarMenuAction>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton href="#history">
                        <span>History</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarSeparator />
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header>
          <SidebarTrigger />
        </header>
      </SidebarInset>
    </SidebarProvider>
  );
}

const outer = () =>
  document.querySelector('[data-slot="sidebar"]') as HTMLElement;
const slot = (name: string) =>
  document.querySelector(`[data-slot="${name}"]`) as HTMLElement;
const trigger = () => slot("sidebar-trigger");

describe("Sidebar", () => {
  afterEach(() => {
    // biome-ignore lint/suspicious/noDocumentCookie: reset shadcn's state cookie.
    document.cookie = "sidebar_state=; max-age=0";
  });

  it("matches shadcn's data-slot tree and exports (plus the surface)", () => {
    for (const variant of ["sidebar", "floating", "inset"] as const) {
      const { unmount } = render(<Usage ui={Shadcn} variant={variant} />);
      const expected = slotTree();
      unmount();
      const godui = render(<Usage ui={Godui} variant={variant} />);
      expect(slotTree()).toContain("div[sidebar-surface]");
      expectSlotParity(slotTree(), expected, ["sidebar-surface"]);
      godui.unmount();
    }
    expect(Object.keys(Godui)).toEqual(
      expect.arrayContaining(Object.keys(Shadcn)),
    );
  });

  it("the trigger and Ctrl/⌘+B flip data-state", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} collapsible="offcanvas" />);
    expect(outer()).toHaveAttribute("data-state", "expanded");
    await user.click(trigger());
    expect(outer()).toHaveAttribute("data-state", "collapsed");
    expect(outer()).toHaveAttribute("data-collapsible", "offcanvas");
    fireEvent.keyDown(window, { key: "b", ctrlKey: true });
    expect(outer()).toHaveAttribute("data-state", "expanded");
    fireEvent.keyDown(window, { key: "b", metaKey: true });
    expect(outer()).toHaveAttribute("data-state", "collapsed");
  });

  it("animates no layout property anywhere in the source", () => {
    const here = dirname(fileURLToPath(import.meta.url));
    const source = readFileSync(join(here, "sidebar.tsx"), "utf8");
    expect(source).not.toContain("transition-[width");
    expect(source).not.toContain("transition-[left");
    expect(source).not.toContain("transition-[margin");
    expect(source).not.toContain("transition-all");
    expect(source).not.toMatch(/\btransition-\[[^\]]*(height|padding)/);
  });

  it("the gap snaps; offcanvas slides the container with translate", () => {
    render(<Usage ui={Godui} collapsible="offcanvas" />);
    expect(slot("sidebar-gap").className).not.toContain("transition");
    const container = slot("sidebar-container");
    expect(container.className).toContain("left-0");
    expect(container.className).not.toContain(
      "group-data-[collapsible=offcanvas]:left-",
    );
    expect(container.className).toContain(
      "group-data-[collapsible=offcanvas]:group-data-[side=left]:-translate-x-full",
    );
    expect(container.className).toContain(
      "group-data-[collapsible=offcanvas]:group-data-[side=right]:translate-x-full",
    );
    // No CSS transition: the move is a WAAPI FLIP on the content's clock, so
    // a reversal restarts every piece from where it's drawn (see below).
    expect(container.className).not.toMatch(/transition-\[/);
  });

  it("icon mode slides the surface; the border lives on the surface", () => {
    render(<Usage ui={Godui} />);
    const surface = slot("sidebar-surface");
    expect(surface.className).toContain(
      "group-data-[collapsible=icon]:group-data-[side=left]:-translate-x-[calc(var(--sidebar-width)-var(--sidebar-width-icon))]",
    );
    expect(surface.className).toContain(
      "group-data-[collapsible=icon]:group-data-[side=right]:translate-x-[calc(var(--sidebar-width)-var(--sidebar-width-icon))]",
    );
    expect(surface.className).not.toMatch(/transition-\[/);
    expect(surface.className).toContain("bg-sidebar");
    expect(surface.className).toContain("pointer-events-none");
    // The inner is see-through on desktop: the surface is the background.
    expect(slot("sidebar-inner").className).not.toContain("bg-sidebar");
  });

  it("the surface is offset outward by the container's border widths, so borders paint on the box edge", () => {
    // jsdom has no layout: give the container a 2px left, 3px top border box
    // (client* are the box minus its borders) and a 1px right/bottom one.
    const dims = {
      clientTop: 3,
      clientLeft: 2,
      clientWidth: 197,
      clientHeight: 596,
      offsetWidth: 200,
      offsetHeight: 600,
    };
    const spies = Object.entries(dims).map(([key, value]) =>
      vi
        .spyOn(HTMLElement.prototype, key as "clientTop", "get")
        .mockReturnValue(value),
    );
    try {
      render(<Usage ui={Godui} />);
      const container = slot("sidebar-container");
      expect(container.style.getPropertyValue("--sidebar-bt")).toBe("3px");
      expect(container.style.getPropertyValue("--sidebar-bl")).toBe("2px");
      expect(container.style.getPropertyValue("--sidebar-br")).toBe("1px");
      expect(container.style.getPropertyValue("--sidebar-bb")).toBe("1px");
      const surface = slot("sidebar-surface").className.split(/\s+/);
      expect(surface).toEqual(
        expect.arrayContaining([
          "top-[calc(var(--sidebar-bt,0px)*-1)]",
          "bottom-[calc(var(--sidebar-bb,0px)*-1)]",
          "group-data-[side=left]:left-[calc(var(--sidebar-bl,0px)*-1)]",
          "group-data-[side=right]:right-[calc(var(--sidebar-br,0px)*-1)]",
        ]),
      );
    } finally {
      for (const spy of spies) spy.mockRestore();
    }
  });

  it("watches the container's size with one observer, not a new one per render", () => {
    const created: { observe: number; disconnect: number }[] = [];
    const Original = globalThis.ResizeObserver;
    globalThis.ResizeObserver = class {
      stats = { observe: 0, disconnect: 0 };
      constructor() {
        created.push(this.stats);
      }
      observe() {
        this.stats.observe++;
      }
      unobserve() {}
      disconnect() {
        this.stats.disconnect++;
      }
    } as unknown as typeof ResizeObserver;
    try {
      const { rerender, unmount } = render(<Usage ui={Godui} />);
      const initial = created.filter((stats) => stats.observe > 0).length;
      expect(initial).toBeGreaterThan(0);
      const before = created.length;
      rerender(<Usage ui={Godui} className="border" />);
      rerender(<Usage ui={Godui} className="border-2" />);
      // None was torn down and rebuilt either.
      expect(created.length).toBe(before);
      expect(created.every((stats) => stats.disconnect === 0)).toBe(true);
      unmount();
    } finally {
      globalThis.ResizeObserver = Original;
    }
  });

  it("without ResizeObserver (a consumer's jsdom) the insets are still published, once, without throwing", () => {
    const Original = globalThis.ResizeObserver;
    delete (globalThis as { ResizeObserver?: unknown }).ResizeObserver;
    try {
      expect("ResizeObserver" in globalThis).toBe(false);
      const getter = vi
        .spyOn(HTMLElement.prototype, "clientLeft", "get")
        .mockReturnValue(2);
      const { rerender } = render(<Usage ui={Godui} />);
      const container = slot("sidebar-container");
      expect(container.style.getPropertyValue("--sidebar-bl")).toBe("2px");
      expect(container.style.getPropertyValue("--sidebar-bt")).toBe("0px");
      expect(() =>
        rerender(<Usage ui={Godui} className="border" />),
      ).not.toThrow();
      expect(container.style.getPropertyValue("--sidebar-bl")).toBe("2px");
      getter.mockRestore();
    } finally {
      globalThis.ResizeObserver = Original;
    }
  });

  it("the surface draws the container's own border, so a call site's border classes carry over", () => {
    // shadcn's sidebar-10/-15 pass className="border-r-0" to Sidebar; it lands
    // on the container. The container's border classes must match shadcn's
    // exactly (same computed border), and the surface — what's painted —
    // inherits that border instead of drawing its own.
    const borders = (el: HTMLElement) =>
      el.className.split(/\s+/).filter((c) => /(^|:)!?border(-|$)/.test(c));
    for (const side of ["left", "right"] as const) {
      for (const className of [undefined, "border-r-0", "border-red-500"]) {
        const { unmount } = render(
          <Usage ui={Shadcn} side={side} className={className} />,
        );
        const expected = borders(slot("sidebar-container"));
        unmount();
        const godui = render(
          <Usage ui={Godui} side={side} className={className} />,
        );
        const container = slot("sidebar-container");
        expect(borders(container), `${side} ${className}`).toEqual(expected);
        // Its own paint is hidden (the box keeps shadcn's border width); the
        // surface paints that border as it slides.
        expect(container.className).toContain(
          "[border-image:linear-gradient(transparent,transparent)_1]",
        );
        const surface = slot("sidebar-surface").className.split(/\s+/);
        expect(surface).toEqual(
          expect.arrayContaining([
            "[border-width:inherit]",
            "[border-style:inherit]",
            "[border-color:inherit]",
          ]),
        );
        expect(surface.filter((c) => /(^|:)border-[lrxy]?$/.test(c))).toEqual(
          [],
        );
        godui.unmount();
      }
    }
    // The floating card draws its own border; its box paints a call site's.
    render(<Usage ui={Godui} variant="floating" className="border" />);
    expect(slot("sidebar-container").className).not.toContain("border-image");
  });

  it("the floating card is a fixed cap, a middle that scales and a cap that slides", () => {
    render(<Usage ui={Godui} variant="floating" />);
    const [left, middle, right] = [...slot("sidebar-surface").children];
    expect(left.className).not.toMatch(/transition-\[/);
    expect(left.className).toContain("rounded-l-lg");
    expect(middle.className).toContain(
      "group-data-[collapsible=icon]:scale-x-0",
    );
    expect(middle.className).toContain("origin-left");
    expect(right.className).toContain("rounded-r-lg");
    expect(right.className).toContain(
      "group-data-[collapsible=icon]:-translate-x-[calc(var(--sidebar-width)-var(--sidebar-width-icon)-(--spacing(4))-2px)]",
    );
    const inner = slot("sidebar-inner");
    expect(inner.className).not.toContain("shadow-sm");
    expect(inner.className).not.toContain("bg-sidebar");
  });

  it("labels fade on the fast clock; menu buttons don't transition their box", () => {
    render(<Usage ui={Godui} />);
    const label = slot("sidebar-group-label");
    expect(label.className).toContain(
      "transition-[opacity] duration-(--godui-duration-fast)",
    );
    const button = slot("sidebar-menu-button");
    expect(button.className).not.toMatch(/transition-\[/);
    const rail = slot("sidebar-rail");
    expect(rail.className).toContain("transition-[translate]");
    expect(rail.className).toContain("ease-spring-smooth");
  });

  it("at rest the wrapper clips nothing: wide content still scrolls the page", () => {
    render(<Usage ui={Godui} />);
    const classes = slot("sidebar-wrapper").className.split(/\s+/);
    expect(classes.filter((c) => /^overflow/.test(c))).toEqual([]);
    expect(classes).toContain("data-moving:overflow-x-clip");
    expect(slot("sidebar-wrapper")).not.toHaveAttribute("data-moving");
  });

  it("while it moves, the wrapper clips x overflow and lifts the content", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    const wrapper = slot("sidebar-wrapper");
    // The move's animations in the wrapper: the glides (260ms) and a
    // sub-menu's delayed fade-in, which is keyed on the flag (ends at 450ms).
    const ends = [260, 450];
    wrapper.getAnimations = () =>
      ends.map((endTime) => ({
        effect: { getComputedTiming: () => ({ endTime }) },
        finished: new Promise((resolve) => setTimeout(resolve, endTime)),
      })) as unknown as Animation[];
    expect(wrapper.className).toContain("ease-spring-smooth");
    expect(wrapper.className).toContain(
      "[&[data-moving]>[data-slot=sidebar]~*]:z-20",
    );
    expect(wrapper).not.toHaveAttribute("data-moving");
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      await user.click(trigger());
      // Set in the commit that snaps the layout, so the first frame clips.
      expect(wrapper).toHaveAttribute("data-moving", "collapsing");
      // Held past the glides (260ms) until the sub-menu's fade has ended too,
      // so it isn't cut short.
      await act(async () => {
        vi.advanceTimersByTime(300);
      });
      expect(wrapper).toHaveAttribute("data-moving");
      await act(async () => {
        vi.advanceTimersByTime(200);
      });
      expect(wrapper).not.toHaveAttribute("data-moving");
    } finally {
      vi.useRealTimers();
    }
  });

  it("a paused animation can't hold the flag: it clears one slow token after it should have ended", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    const wrapper = slot("sidebar-wrapper");
    // Finite (ends at 450ms), but never finishes (paused by your CSS, say).
    wrapper.getAnimations = () =>
      [
        {
          effect: { getComputedTiming: () => ({ endTime: 450, localTime: 0 }) },
          finished: new Promise(() => {}),
        },
      ] as unknown as Animation[];
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      await user.click(trigger());
      expect(wrapper).toHaveAttribute("data-moving", "collapsing");
      // 450ms + --godui-duration-slow (380ms; jsdom has no CSS: the fallback).
      await act(async () => {
        vi.advanceTimersByTime(780);
      });
      expect(wrapper).toHaveAttribute("data-moving");
      await act(async () => {
        vi.advanceTimersByTime(80);
      });
      expect(wrapper).not.toHaveAttribute("data-moving");
    } finally {
      vi.useRealTimers();
    }
  });

  it("an unrelated long animation in the content doesn't hold the flag; it clears when the glide ends", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    const wrapper = slot("sidebar-wrapper");
    // A 5s entrance already 1s into its run inside the inset, plus this
    // move's glide (fresh, 260ms).
    wrapper.getAnimations = () =>
      [
        {
          currentTime: 1000,
          playbackRate: 1,
          effect: {
            getComputedTiming: () => ({ endTime: 5000, localTime: 1000 }),
          },
          finished: new Promise((resolve) => setTimeout(resolve, 4000)),
        },
        {
          currentTime: 0,
          playbackRate: 1,
          effect: {
            getComputedTiming: () => ({ endTime: 260, localTime: 0 }),
          },
          finished: new Promise((resolve) => setTimeout(resolve, 260)),
        },
      ] as unknown as Animation[];
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      await user.click(trigger());
      expect(wrapper).toHaveAttribute("data-moving", "collapsing");
      await act(async () => {
        vi.advanceTimersByTime(300);
      });
      expect(wrapper).not.toHaveAttribute("data-moving");
    } finally {
      vi.useRealTimers();
    }
  });

  it("the cap scales with playbackRate", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    const wrapper = slot("sidebar-wrapper");
    // Never finishes; ends at 3000ms of effect time, played at 3x: 1000ms of
    // real time, + 380ms of slack (unscaled it would hold until 3380ms).
    wrapper.getAnimations = () =>
      [
        {
          currentTime: 0,
          playbackRate: 3,
          effect: {
            getComputedTiming: () => ({ endTime: 3000, localTime: 0 }),
          },
          finished: new Promise(() => {}),
        },
      ] as unknown as Animation[];
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      await user.click(trigger());
      await act(async () => {
        vi.advanceTimersByTime(1200);
      });
      expect(wrapper).toHaveAttribute("data-moving");
      await act(async () => {
        vi.advanceTimersByTime(300);
      });
      expect(wrapper).not.toHaveAttribute("data-moving");
    } finally {
      vi.useRealTimers();
    }
  });

  it("only an icon sidebar fades its sub-menus back in (offcanvas never hid them)", () => {
    const fade =
      "in-data-[moving=expanding]:[&_[data-sidebar=menu-sub]]:animate-godui-fade-in";
    const { unmount } = render(<Usage ui={Godui} collapsible="icon" />);
    expect(slot("sidebar-container").className).toContain(fade);
    expect(slot("sidebar-menu-sub").className).not.toMatch(/animate-/);
    unmount();
    render(<Usage ui={Godui} collapsible="offcanvas" />);
    expect(slot("sidebar-container").className).not.toContain(fade);
  });

  it('collapsible="none" renders shadcn\'s static panel, no surface', () => {
    render(<Usage ui={Godui} collapsible="none" />);
    expect(slot("sidebar-surface")).toBeNull();
    expect(outer().className).toContain("bg-sidebar");
  });

  it("passes a React 19 callback ref's cleanup through (SidebarProvider)", () => {
    const cleanup = vi.fn();
    const seen: Array<HTMLElement | null> = [];
    const ref = (node: HTMLDivElement | null) => {
      seen.push(node);
      return cleanup;
    };
    const { unmount } = render(
      <Godui.SidebarProvider ref={ref}>
        <Godui.SidebarInset />
      </Godui.SidebarProvider>,
    );
    expect(seen[0]).toBe(slot("sidebar-wrapper"));
    unmount();
    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(seen).not.toContain(null);
  });
});

describe("Sidebar FLIP", () => {
  // jsdom has no layout. The inset's left edge follows the gap (256px open,
  // 48px icon, 0 offcanvas); a group label sits 32px higher in icon mode.
  // Running FLIP offsets are added like a browser's getBoundingClientRect.
  const drawn = new Map<Element, { x: number; y: number }>();
  const originalRect = Element.prototype.getBoundingClientRect;
  let calls: Array<{ el: Element; frames: Keyframe[] }>;
  let reduce = false;
  const originalMatchMedia = window.matchMedia;

  function base(el: Element): { x: number; y: number } {
    const sidebar = document.querySelector('[data-slot="sidebar"]');
    const mode = sidebar?.getAttribute("data-collapsible") ?? "";
    const slotName = el.getAttribute("data-slot");
    if (slotName === "sidebar-inset") {
      return { x: mode === "offcanvas" ? 0 : mode === "icon" ? 48 : 256, y: 0 };
    }
    // The panel's pieces: their class translate moves them (offcanvas: the
    // container; icon: the surface, or the floating card's far cap).
    if (slotName === "sidebar-container") {
      return { x: mode === "offcanvas" ? -256 : 0, y: 0 };
    }
    if (slotName === "sidebar-surface") {
      return { x: mode === "icon" ? -208 : 0, y: 0 };
    }
    if (
      el.parentElement?.getAttribute("data-slot") === "sidebar-surface" &&
      !el.nextElementSibling
    ) {
      return { x: mode === "icon" ? 42 : 232, y: 0 };
    }
    if (slotName === "sidebar-group-label") {
      return { x: 8, y: mode === "icon" ? 64 : 96 };
    }
    // A right panel's box grows leftwards: its inner's left edge moves.
    if (
      slotName === "sidebar-inner" &&
      sidebar?.getAttribute("data-side") === "right"
    ) {
      return { x: mode === "icon" ? 976 : 768, y: 0 };
    }
    // A large button's padding snaps to 0: its leading icon moves 8px.
    if (
      el.parentElement?.getAttribute("data-size") === "lg" &&
      !el.previousElementSibling
    ) {
      return mode === "icon" ? { x: 8, y: 8 } : { x: 16, y: 16 };
    }
    return { x: 0, y: 0 };
  }

  /**
   * The resting translate a class gives the panel's pieces (jsdom has no CSS):
   * offcanvas moves the container, icon mode the surface.
   */
  function rest(el: Element): string | null {
    const mode =
      document
        .querySelector('[data-slot="sidebar"]')
        ?.getAttribute("data-collapsible") ?? "";
    const slotName = el.getAttribute("data-slot");
    if (slotName === "sidebar-container")
      return mode === "offcanvas" ? "-256px 0px" : "0px 0px";
    if (slotName === "sidebar-surface")
      return mode === "icon" ? "-208px 0px" : "0px 0px";
    return null;
  }
  const px = (value: string | null) =>
    (value ?? "0px 0px").split(" ").map((v) => Number.parseFloat(v));
  const originalComputed = window.getComputedStyle;

  beforeEach(() => {
    drawn.clear();
    calls = [];
    reduce = false;
    window.getComputedStyle = ((el: Element, pseudo?: string | null) => {
      const style = originalComputed.call(window, el, pseudo);
      const translate = rest(el);
      if (translate === null) return style;
      return new Proxy(style, {
        get(target, key) {
          if (key === "translate") return translate;
          const value = Reflect.get(target, key);
          return typeof value === "function" ? value.bind(target) : value;
        },
      });
    }) as typeof window.getComputedStyle;
    Element.prototype.getBoundingClientRect = function (this: Element) {
      const at = base(this);
      const off = drawn.get(this) ?? { x: 0, y: 0 };
      const left = at.x + off.x;
      const top = at.y + off.y;
      return { left, top, x: left, y: top, width: 10, height: 10 } as DOMRect;
    };
    Element.prototype.animate = function (this: Element, frames: Keyframe[]) {
      calls.push({ el: this, frames });
      // Like a browser, the FLIP replaces the element's translate: it's drawn
      // at the first keyframe, i.e. that far from its class rest.
      const [x, y] = px(String(frames[0].translate));
      const [ownX, ownY] = px(rest(this));
      drawn.set(this, { x: x - ownX, y: y - ownY });

      return {
        effect: { getKeyframes: () => frames },
        cancel: () => drawn.delete(this),
        onfinish: null,
        finished: new Promise(() => {}),
      } as unknown as Animation;
    } as Element["animate"];
    window.matchMedia = ((query: string) => ({
      matches: reduce && query.includes("reduce"),
      media: query,
      addEventListener() {},
      removeEventListener() {},
    })) as unknown as typeof window.matchMedia;
  });

  afterEach(() => {
    window.getComputedStyle = originalComputed;
    Element.prototype.getBoundingClientRect = originalRect;
    delete (Element.prototype as Partial<Element>).animate;
    window.matchMedia = originalMatchMedia;
  });

  const animated = (name: string) =>
    calls.find((c) => c.el.getAttribute("data-slot") === name);

  for (const [mode, dx] of [
    ["offcanvas", 256],
    ["icon", 208],
  ] as const) {
    it(`${mode}: the content beside the sidebar glides from where it was`, async () => {
      const user = userEvent.setup();
      render(<Usage ui={Godui} collapsible={mode} />);
      await user.click(trigger());
      const inset = animated("sidebar-inset");
      expect(inset?.frames[0].translate).toBe(`${dx}px 0px`);
      expect(inset?.frames[1].translate).toBe("0px 0px");
      // Reversed halfway: it starts from where it is drawn, no jump.
      drawn.set(slot("sidebar-inset"), { x: dx / 2, y: 0 });
      calls = [];
      await user.click(trigger());
      expect(animated("sidebar-inset")?.frames[0].translate).toBe(
        `${-dx / 2}px 0px`,
      );
    });
  }

  it("the panel moves on the content's FLIP clock, from where it's drawn", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Usage ui={Godui} collapsible="offcanvas" />);
    await user.click(trigger());
    // Its class rest is now -256px: the FLIP holds it at 0 and lets it go.
    expect(animated("sidebar-container")?.frames).toEqual([
      { translate: "0px 0px" },
      { translate: "-256px 0px" },
    ]);
    // Reversed halfway, when both were drawn at 128 / -128. The panel's
    // class rest is back to 0, but its running FLIP replaces translate, so it
    // is still drawn at -128. The content's FLIP is an offset (+128) from its
    // layout spot, which just snapped back to 256.
    drawn.set(slot("sidebar-container"), { x: -128, y: 0 });
    drawn.set(slot("sidebar-inset"), { x: 128, y: 0 });
    calls = [];
    await user.click(trigger());
    // Both carry on from what was drawn (-128 / 128), still glued. Without
    // accounting for the panel's own rest changing under its running FLIP,
    // the panel would restart from -384.
    expect(animated("sidebar-container")?.frames[0].translate).toBe(
      "-128px 0px",
    );
    expect(animated("sidebar-inset")?.frames[0].translate).toBe("-128px 0px");
    unmount();
    calls = [];
    render(<Usage ui={Godui} collapsible="icon" />);
    await user.click(trigger());
    expect(animated("sidebar-surface")?.frames).toEqual([
      { translate: "0px 0px" },
      { translate: "-208px 0px" },
    ]);
    expect(animated("sidebar-container")).toBeUndefined();
  });

  it("floating icon card: the far cap glides and the middle stretches on one clock", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} collapsible="icon" variant="floating" />);
    await user.click(trigger());
    const [, middle, cap] = [...slot("sidebar-surface").children];
    expect(calls.find((c) => c.el === cap)?.frames[0].translate).toBe(
      "190px 0px",
    );
    const stretch = calls.find((c) => c.el === middle);
    expect(stretch?.frames).toEqual([{ scale: "1 1" }, { scale: "0 1" }]);
  });

  it("icon mode: the group label glides up as it fades", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} collapsible="icon" />);
    await user.click(trigger());
    expect(animated("sidebar-group-label")?.frames[0].translate).toBe(
      "0px 32px",
    );
  });

  it("icon mode: a large button glides by its icon's move, so the icon isn't clipped", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} collapsible="icon" />);
    await user.click(trigger());
    const lg = document.querySelector(
      '[data-sidebar="menu-button"][data-size="lg"]',
    );
    const call = calls.find((c) => c.el === lg);
    expect(call?.frames[0].translate).toBe("8px 8px");
    expect(calls.find((c) => c.el === lg?.firstElementChild)).toBeUndefined();
  });

  it("right icon panel: the content glides with the edge instead of jumping", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} collapsible="icon" side="right" />);
    await user.click(trigger());
    expect(animated("sidebar-inner")?.frames[0].translate).toBe("-208px 0px");
  });

  it("left and offcanvas panels never FLIP the inner", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Usage ui={Godui} collapsible="icon" />);
    await user.click(trigger());
    expect(animated("sidebar-inner")).toBeUndefined();
    unmount();
    render(<Usage ui={Godui} collapsible="offcanvas" side="right" />);
    await user.click(trigger());
    expect(animated("sidebar-inner")).toBeUndefined();
  });

  it("reduced motion: nothing glides", async () => {
    reduce = true;
    const user = userEvent.setup();
    render(<Usage ui={Godui} collapsible="icon" />);
    await user.click(trigger());
    expect(outer()).toHaveAttribute("data-state", "collapsed");
    expect(calls).toEqual([]);
  });
});
