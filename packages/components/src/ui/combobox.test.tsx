import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { expectSlotParity, slotTree } from "../../test/parity";
import * as Shadcn from "../../test/shadcn/combobox";
import * as Godui from "./combobox";

const FRAMEWORKS = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"];

// Chips lay out left to right, 60px each, in DOM order.
const originalRect = Element.prototype.getBoundingClientRect;
let animate: ReturnType<typeof vi.fn>;
let handles: Array<{ cancel: ReturnType<typeof vi.fn>; onfinish: null }>;

beforeEach(() => {
  Element.prototype.getBoundingClientRect = function (this: Element) {
    let left = 0;
    if (
      this.matches(
        '[data-slot="combobox-chip"], [data-slot="combobox-chip-input"]',
      )
    ) {
      const siblings = [
        ...(this.parentElement?.querySelectorAll(
          ':scope > [data-slot="combobox-chip"], :scope > [data-slot="combobox-chip-input"]',
        ) ?? []),
      ];
      left = siblings.indexOf(this) * 60;
    }
    return { left, top: 0, width: 56, height: 22, x: left, y: 0 } as DOMRect;
  };
  handles = [];
  animate = vi.fn(() => {
    const handle = { cancel: vi.fn(), onfinish: null };
    handles.push(handle);
    return handle;
  });
  Element.prototype.animate = animate as unknown as Element["animate"];
});

afterEach(() => {
  Element.prototype.getBoundingClientRect = originalRect;
  delete (Element.prototype as Partial<Element>).animate;
});

function Single({
  ui,
  defaultOpen,
}: {
  ui: typeof Shadcn;
  defaultOpen?: boolean;
}) {
  const {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
  } = ui;
  return (
    <Combobox items={FRAMEWORKS} defaultOpen={defaultOpen}>
      <ComboboxInput placeholder="Select a framework" />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

function Multiple({ ui }: { ui: typeof Shadcn }) {
  const {
    Combobox,
    ComboboxChip,
    ComboboxChips,
    ComboboxChipsInput,
    ComboboxContent,
    ComboboxItem,
    ComboboxList,
    ComboboxValue,
    useComboboxAnchor,
  } = ui;
  const anchor = useComboboxAnchor();
  return (
    <Combobox
      multiple
      items={FRAMEWORKS}
      defaultValue={["Next.js", "Remix", "Astro"]}
    >
      <ComboboxChips ref={anchor}>
        <ComboboxValue>
          {(values: string[]) => (
            <React.Fragment>
              {values.map((value) => (
                <ComboboxChip key={value}>{value}</ComboboxChip>
              ))}
              <ComboboxChipsInput aria-label="Frameworks" />
            </React.Fragment>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

const chips = () => [
  ...document.querySelectorAll('[data-slot="combobox-chip"]'),
];
const removeButtons = () =>
  [
    ...document.querySelectorAll('[data-slot="combobox-chip-remove"]'),
  ] as HTMLElement[];

describe("Combobox", () => {
  it.each([
    ["single, open", (ui: typeof Shadcn) => <Single ui={ui} defaultOpen />],
    ["multiple chips", (ui: typeof Shadcn) => <Multiple ui={ui} />],
  ])("matches shadcn's data-slot tree (%s)", (_, usage) => {
    const { unmount } = render(usage(Shadcn));
    const expected = slotTree();
    unmount();
    render(usage(Godui as unknown as typeof Shadcn));
    expectSlotParity(slotTree(), expected);
    expect(Object.keys(Godui)).toEqual(
      expect.arrayContaining(Object.keys(Shadcn)),
    );
  });

  it("filters while typing and selects an item", async () => {
    const user = userEvent.setup();
    render(<Single ui={Godui} />);
    const input = screen.getByPlaceholderText("Select a framework");
    await user.type(input, "sv");
    await waitFor(() =>
      expect(
        screen.getByRole("option", { name: "SvelteKit" }),
      ).toBeInTheDocument(),
    );
    expect(screen.queryByRole("option", { name: "Remix" })).toBeNull();
    await user.click(screen.getByRole("option", { name: "SvelteKit" }));
    await waitFor(() => expect(input).toHaveValue("SvelteKit"));
  });

  it("popup grows on a spring; chips pop in", () => {
    render(<Single ui={Godui} defaultOpen />);
    const popup = document.querySelector('[data-slot="combobox-content"]');
    expect(popup?.className).toContain("data-open:animate-godui-popover-in");
    expect(popup?.className).toContain("data-closed:animate-godui-popover-out");
    expect(popup?.className).not.toMatch(
      /animate-in|zoom-in|slide-in-from|duration-100/,
    );
  });

  it("removing a chip FLIPs the chips after it", async () => {
    const user = userEvent.setup();
    render(<Multiple ui={Godui} />);
    expect(chips()[0].className).toContain("animate-godui-fade-scale-in");
    await user.click(removeButtons()[0]);
    await waitFor(() => expect(chips()).toHaveLength(2));
    const moved = animate.mock.contexts as unknown as Element[];
    expect(moved).toContain(chips()[0]);
    const [frames] = animate.mock.calls[0] as unknown as [Keyframe[]];
    expect(frames[0]).toMatchObject({ translate: "60px 0px" });
  });

  it("removing a chip mid-FLIP carries (cancels, then re-plays)", async () => {
    const user = userEvent.setup();
    render(<Multiple ui={Godui} />);
    await user.click(removeButtons()[0]);
    await waitFor(() => expect(chips()).toHaveLength(2));
    const firstCount = animate.mock.calls.length;
    await user.click(removeButtons()[0]);
    await waitFor(() => expect(chips()).toHaveLength(1));
    // A surviving chip's running FLIP was cancelled and carried into the next.
    expect(handles.some((handle) => handle.cancel.mock.calls.length > 0)).toBe(
      true,
    );
    expect(animate.mock.calls.length).toBeGreaterThan(firstCount);
  });

  it("chips don't transition paint", () => {
    render(<Multiple ui={Godui} />);
    const container = document.querySelector('[data-slot="combobox-chips"]');
    expect(container?.className).not.toContain("transition-[color");
  });
});
