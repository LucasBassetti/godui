import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectSlotParity, slotTree } from "../../test/parity";
import * as Shadcn from "../../test/shadcn/command";
import * as Godui from "./command";

// jsdom has no layout: offset* read data-y/h; items are 32px rows.
const GEOMETRY = [
  ["offsetLeft", "data-x"],
  ["offsetTop", "data-y"],
  ["offsetWidth", "data-w"],
  ["offsetHeight", "data-h"],
] as const;
const saved = GEOMETRY.map(([prop]) => [
  prop,
  Object.getOwnPropertyDescriptor(HTMLElement.prototype, prop),
]);
let animate: ReturnType<typeof vi.fn>;

beforeAll(() => {
  Element.prototype.scrollIntoView ??= () => {};
});

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

const ITEMS = ["Calendar", "Search Emoji", "Calculator"];

function Usage({ ui }: { ui: typeof Shadcn }) {
  const {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
  } = ui;
  return (
    <Command className="rounded-lg border shadow-md md:min-w-[450px]">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          {ITEMS.map((item, i) => (
            <CommandItem
              key={item}
              data-x="4"
              data-y={4 + i * 32}
              data-w="200"
              data-h="32"
            >
              {item}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem data-x="4" data-y="140" data-w="200" data-h="32">
            Profile
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

const list = () =>
  document.querySelector('[data-slot="command-list"]') as HTMLElement;
const indicator = () =>
  document.querySelector(
    '[data-slot="command-indicator"]',
  ) as HTMLElement | null;

describe("Command", () => {
  it("matches shadcn's data-slot tree (plus the indicator) and exports", () => {
    const { unmount } = render(<Usage ui={Shadcn} />);
    const expected = slotTree();
    unmount();
    render(<Usage ui={Godui} />);
    expectSlotParity(slotTree(), expected, ["command-indicator"]);
    expect(Object.keys(Godui)).toEqual(
      expect.arrayContaining(Object.keys(Shadcn)),
    );
  });

  it("CommandDialog renders through the GodUI Dialog", () => {
    const { CommandDialog, CommandInput, CommandList, CommandItem } = Godui;
    render(
      <CommandDialog open>
        <CommandInput placeholder="Search" />
        <CommandList>
          <CommandItem>One</CommandItem>
        </CommandList>
      </CommandDialog>,
    );
    expect(
      document.querySelector('[data-slot="dialog-content"]')?.className,
    ).toContain("animate-godui-fade-scale-in");
  });

  it("the indicator starts on the selected item and slides on ArrowDown", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    await waitFor(() =>
      expect(list()).toHaveAttribute("data-indicator", "ready"),
    );
    expect(indicator()?.style.translate).toBe("4px 4px");
    screen.getByPlaceholderText("Type a command or search...").focus();
    await user.keyboard("{ArrowDown}");
    await waitFor(() => expect(animate).toHaveBeenCalled());
    const [frames] = animate.mock.calls.at(-1) as unknown as [Keyframe[]];
    expect(frames[1]).toMatchObject({ translate: "4px 36px" });
  });

  it("typing snaps the indicator to the first match", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    await waitFor(() =>
      expect(list()).toHaveAttribute("data-indicator", "ready"),
    );
    await user.type(
      screen.getByPlaceholderText("Type a command or search..."),
      "calc",
    );
    await waitFor(() =>
      expect(
        screen.getByRole("option", { name: "Calculator" }),
      ).toHaveAttribute("data-selected", "true"),
    );
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 20));
    });
    expect(indicator()?.style.translate).toBe("4px 68px");
    expect(animate).not.toHaveBeenCalled();
  });

  it("no results: the indicator hides", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    await user.type(
      screen.getByPlaceholderText("Type a command or search..."),
      "zzzz",
    );
    await waitFor(() => expect(list()).not.toHaveAttribute("data-indicator"));
  });

  it("items keep shadcn's selected background until the indicator is ready", () => {
    render(<Usage ui={Godui} />);
    const item = screen.getByRole("option", { name: "Calendar" });
    expect(item.className).toContain(
      "not-in-[[data-slot=command-list][data-indicator=ready]]:data-[selected=true]:bg-accent",
    );
  });
});
