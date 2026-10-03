import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectSlotParity, slotTree } from "../../test/parity";
import * as Shadcn from "../../test/shadcn/toggle-group";
import * as Godui from "./toggle-group";

const GEOMETRY = [
  ["offsetLeft", "data-x"],
  ["offsetWidth", "data-w"],
  ["offsetHeight", "data-h"],
] as const;
const saved = GEOMETRY.map(([prop]) => [
  prop,
  Object.getOwnPropertyDescriptor(HTMLElement.prototype, prop),
]);
let animate: ReturnType<typeof vi.fn>;

beforeEach(() => {
  for (const [prop, attr] of GEOMETRY) {
    Object.defineProperty(HTMLElement.prototype, prop, {
      configurable: true,
      get() {
        return Number(this.getAttribute(attr) ?? 0);
      },
    });
  }
  animate = vi.fn(() => ({ cancel: vi.fn(), onfinish: null }));
  Element.prototype.animate = animate as unknown as Element["animate"];
});

afterEach(() => {
  for (const [prop, descriptor] of saved) {
    if (descriptor)
      Object.defineProperty(HTMLElement.prototype, prop as string, descriptor);
  }
  delete (Element.prototype as Partial<Element>).animate;
});

function Single({ ui }: { ui: typeof Shadcn }) {
  const { ToggleGroup, ToggleGroupItem } = ui;
  return (
    <ToggleGroup type="single" defaultValue="left" variant="outline">
      <ToggleGroupItem
        value="left"
        aria-label="Left"
        data-x="0"
        data-w="36"
        data-h="36"
      >
        L
      </ToggleGroupItem>
      <ToggleGroupItem
        value="center"
        aria-label="Center"
        data-x="36"
        data-w="36"
        data-h="36"
      >
        C
      </ToggleGroupItem>
      <ToggleGroupItem
        value="right"
        aria-label="Right"
        data-x="72"
        data-w="48"
        data-h="36"
      >
        R
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

function Multiple({ ui }: { ui: typeof Shadcn }) {
  const { ToggleGroup, ToggleGroupItem } = ui;
  return (
    <ToggleGroup type="multiple" defaultValue={["bold"]}>
      <ToggleGroupItem value="bold" aria-label="Bold">
        B
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        I
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        U
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

const group = () =>
  document.querySelector('[data-slot="toggle-group"]') as HTMLElement;
const indicator = () =>
  document.querySelector(
    '[data-slot="toggle-group-indicator"]',
  ) as HTMLElement | null;

describe("ToggleGroup", () => {
  it.each([
    Single,
    Multiple,
  ])("matches shadcn's data-slot tree (%#)", (Usage) => {
    const { unmount } = render(<Usage ui={Shadcn} />);
    const expected = slotTree();
    unmount();
    render(<Usage ui={Godui} />);
    expectSlotParity(slotTree(), expected, ["toggle-group-indicator"]);
    expect(Object.keys(Godui)).toEqual(
      expect.arrayContaining(Object.keys(Shadcn)),
    );
  });

  it("single: the indicator sits on the pressed item, then slides", async () => {
    const user = userEvent.setup();
    render(<Single ui={Godui} />);
    expect(group()).toHaveAttribute("data-indicator", "ready");
    expect(indicator()?.style.width).toBe("36px");
    await user.click(screen.getByRole("radio", { name: "Right" }));
    await waitFor(() => expect(animate).toHaveBeenCalledTimes(1));
    const [frames] = animate.mock.calls[0] as unknown as [Keyframe[]];
    expect(frames[1]).toMatchObject({ translate: "72px 0px", scale: "1 1" });
  });

  it("first/last item styling ignores the injected indicator", () => {
    render(<Single ui={Godui} />);
    const cls = document.querySelector(
      '[data-slot="toggle-group-item"]',
    )?.className;
    // shadcn's first:/last: would match the indicator span instead.
    expect(cls).toContain(
      "data-[spacing=0]:[&:nth-child(1_of_[data-slot=toggle-group-item])]:rounded-l-md",
    );
    expect(cls).toContain(
      "data-[spacing=0]:[&:nth-last-child(1_of_[data-slot=toggle-group-item])]:rounded-r-md",
    );
    expect(cls).not.toMatch(/(^|\s)data-\[spacing=0\]:first:/);
  });

  it("joined cells: a square indicator clipped by the group's shape, so only the ends round", () => {
    render(<Single ui={Godui} />);
    const el = indicator() as HTMLElement;
    // shadcn's joined items are square cells; the group's corners round the
    // ends. The indicator matches: square, inside a clip with the group's radius.
    expect(el.className).toContain(
      "group-data-[spacing=0]/toggle-group:rounded-none",
    );
    const clip = el.parentElement as HTMLElement;
    expect(clip.parentElement).toBe(group());
    expect(clip.className).toContain("overflow-hidden");
    expect(clip.className).toContain("rounded-[inherit]");
    expect(clip.className).toContain("inset-0");
    expect(clip).toHaveAttribute("aria-hidden", "true");
  });

  it("items hand their on background to a ready indicator", () => {
    render(<Single ui={Godui} />);
    expect(
      document.querySelector('[data-slot="toggle-group-item"]')?.className,
    ).toContain(
      "in-[[data-slot=toggle-group][data-indicator=ready]]:data-[state=on]:bg-transparent",
    );
  });

  it("multiple: no indicator, items keep their own on background", () => {
    render(<Multiple ui={Godui} />);
    expect(indicator()).toBeNull();
    expect(group()).not.toHaveAttribute("data-indicator");
    expect(screen.getByRole("button", { name: "Bold" }).className).toContain(
      "data-[state=on]:bg-accent",
    );
  });

  it("arrow keys move focus between items", async () => {
    const user = userEvent.setup();
    render(<Single ui={Godui} />);
    await user.click(screen.getByRole("radio", { name: "Left" }));
    await user.keyboard("{ArrowRight}");
    await waitFor(() =>
      expect(screen.getByRole("radio", { name: "Center" })).toHaveFocus(),
    );
  });

  it("passes a React 19 callback ref's cleanup through (ToggleGroup)", () => {
    const cleanup = vi.fn();
    const seen: Array<HTMLElement | null> = [];
    const ref = (node: HTMLDivElement | null) => {
      seen.push(node);
      return cleanup;
    };
    const { unmount } = render(
      <Godui.ToggleGroup ref={ref} type="single" aria-label="Align">
        <Godui.ToggleGroupItem value="left">Left</Godui.ToggleGroupItem>
        <Godui.ToggleGroupItem value="right">Right</Godui.ToggleGroupItem>
      </Godui.ToggleGroup>,
    );
    expect(seen).toEqual([
      document.querySelector('[data-slot="toggle-group"]'),
    ]);
    unmount();
    expect(cleanup).toHaveBeenCalledTimes(1);
    // React calls the cleanup instead of ref(null).
    expect(seen).not.toContain(null);
  });
});
