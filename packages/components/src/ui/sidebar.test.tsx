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
}: {
  ui: typeof Shadcn;
  collapsible?: Collapsible;
  variant?: "sidebar" | "floating" | "inset";
  side?: "left" | "right";
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
      <Sidebar collapsible={collapsible} variant={variant} side={side}>
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
    expect(surface.className).toContain(
      "group-data-[variant=sidebar]:group-data-[side=left]:border-r",
    );
    expect(surface.className).toContain("pointer-events-none");
    // The inner is see-through on desktop: the surface is the background.
    expect(slot("sidebar-inner").className).not.toContain("bg-sidebar");
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

  it("the wrapper clips x overflow and lifts the content while it moves", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    const wrapper = slot("sidebar-wrapper");
    expect(wrapper.className).toContain("overflow-x-clip");
    expect(wrapper.className).toContain("ease-spring-smooth");
    expect(wrapper.className).toContain(
      "[&[data-moving]>[data-slot=sidebar]~*]:z-20",
    );
    expect(wrapper).not.toHaveAttribute("data-moving");
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      await user.click(trigger());
      expect(wrapper).toHaveAttribute("data-moving");
      act(() => {
        vi.advanceTimersByTime(300);
      });
      expect(wrapper).not.toHaveAttribute("data-moving");
    } finally {
      vi.useRealTimers();
    }
  });

  it('collapsible="none" renders shadcn\'s static panel, no surface', () => {
    render(<Usage ui={Godui} collapsible="none" />);
    expect(slot("sidebar-surface")).toBeNull();
    expect(outer().className).toContain("bg-sidebar");
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

  beforeEach(() => {
    drawn.clear();
    calls = [];
    reduce = false;
    Element.prototype.getBoundingClientRect = function (this: Element) {
      const at = base(this);
      const off = drawn.get(this) ?? { x: 0, y: 0 };
      const left = at.x + off.x;
      const top = at.y + off.y;
      return { left, top, x: left, y: top, width: 10, height: 10 } as DOMRect;
    };
    Element.prototype.animate = function (this: Element, frames: Keyframe[]) {
      calls.push({ el: this, frames });
      const [x, y] = String(frames[0].translate)
        .split(" ")
        .map((v) => Number.parseFloat(v));
      drawn.set(this, { x, y });

      return {
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
    expect(animated("sidebar-container")?.frames[0].translate).toBe(
      "256px 0px",
    );
    // Reversed halfway: container and content carry on from what's drawn.
    drawn.set(slot("sidebar-container"), { x: 128, y: 0 });
    drawn.set(slot("sidebar-inset"), { x: 128, y: 0 });
    calls = [];
    await user.click(trigger());
    expect(animated("sidebar-container")?.frames[0].translate).toBe(
      "-128px 0px",
    );
    expect(animated("sidebar-inset")?.frames[0].translate).toBe("-128px 0px");
    unmount();
    calls = [];
    render(<Usage ui={Godui} collapsible="icon" />);
    await user.click(trigger());
    expect(animated("sidebar-surface")?.frames[0].translate).toBe("208px 0px");
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
