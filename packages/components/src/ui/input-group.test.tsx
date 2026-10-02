import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ArrowUpIcon, PlusIcon, SearchIcon } from "lucide-react";
import { expectSlotParity, slotTree } from "../../test/parity";
import * as Shadcn from "../../test/shadcn/input-group";
import * as Godui from "./input-group";

/** shadcn's input-group demo: search addon, button addon, textarea block-end. */
function Usage({ ui }: { ui: typeof Shadcn }) {
  const {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupText,
    InputGroupTextarea,
  } = ui;
  return (
    <div className="grid w-full max-w-sm gap-6">
      <InputGroup>
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">12 results</InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="example.com" aria-invalid />
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" aria-label="Info">
            <PlusIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupTextarea placeholder="Ask, Search or Chat..." />
        <InputGroupAddon align="block-end">
          <InputGroupText className="ml-auto">52% used</InputGroupText>
          <InputGroupButton variant="default" size="icon-xs" disabled>
            <ArrowUpIcon />
            <span className="sr-only">Send</span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

const groups = () => [
  ...document.querySelectorAll<HTMLElement>('[data-slot="input-group"]'),
];
const classesOf = (el: HTMLElement) => el.className.split(/\s+/);

describe("InputGroup", () => {
  it("matches shadcn's data-slot tree and exports", () => {
    const { unmount } = render(<Usage ui={Shadcn} />);
    const expected = slotTree();
    unmount();
    render(<Usage ui={Godui} />);
    expectSlotParity(slotTree(), expected);
    expect(Object.keys(Godui)).toEqual(
      expect.arrayContaining(Object.keys(Shadcn)),
    );
  });

  it("draws the focus ring on a ::before layer, never on the group's box-shadow", () => {
    render(<Usage ui={Godui} />);
    for (const group of groups()) {
      const rings = classesOf(group).filter((c) => /(^|:)ring-/.test(c));
      expect(rings.length).toBeGreaterThan(0);
      // Every ring utility targets the pseudo-element.
      expect(rings.filter((c) => !c.includes("before:"))).toEqual([]);
    }
  });

  it("fades and scales the ::before ring in on focus; the border snaps", () => {
    render(<Usage ui={Godui} />);
    const classes = classesOf(groups()[0]);
    expect(classes).toEqual(
      expect.arrayContaining([
        "before:pointer-events-none",
        "before:absolute",
        "before:-inset-px",
        "before:rounded-[inherit]",
        "before:opacity-0",
        "before:ring-[3px]",
        "before:ring-ring/50",
        "before:scale-[0.99]",
        "before:transition-[opacity,scale]",
        "before:duration-(--godui-duration-fast)",
        "before:ease-out-expo",
        "has-[[data-slot=input-group-control]:focus-visible]:before:opacity-100",
        "has-[[data-slot=input-group-control]:focus-visible]:before:scale-100",
        "has-[[data-slot=input-group-control]:focus-visible]:border-ring",
        "has-[[data-slot][aria-invalid=true]]:border-destructive",
        "has-[[data-slot][aria-invalid=true]]:before:ring-destructive/20",
        "dark:has-[[data-slot][aria-invalid=true]]:before:ring-destructive/40",
      ]),
    );
    // Only compositor properties transition; the border colour snaps.
    const transitions = classes.filter((c) =>
      /(^|:)transition-(?!none)/.test(c),
    );
    expect(transitions).toEqual(["before:transition-[opacity,scale]"]);
  });

  it("reduced motion: the ring appears without a transition", () => {
    render(<Usage ui={Godui} />);
    expect(classesOf(groups()[0])).toContain(
      "motion-reduce:before:transition-none",
    );
  });

  it("keeps the group a positioned box that doesn't clip the ring", () => {
    render(<Usage ui={Godui} />);
    const classes = classesOf(groups()[0]);
    expect(classes).toContain("relative");
    expect(classes.filter((c) => c.startsWith("overflow-"))).toEqual([]);
  });

  it("clicking an addon focuses the input; addon buttons stay clickable", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Godui.InputGroup>
        <Godui.InputGroupInput placeholder="Search..." />
        <Godui.InputGroupAddon>
          <SearchIcon data-testid="icon" />
        </Godui.InputGroupAddon>
        <Godui.InputGroupAddon align="inline-end">
          <Godui.InputGroupButton onClick={onClick}>Go</Godui.InputGroupButton>
        </Godui.InputGroupAddon>
      </Godui.InputGroup>,
    );
    await user.click(screen.getByTestId("icon"));
    expect(screen.getByPlaceholderText("Search...")).toHaveFocus();
    await user.click(screen.getByRole("button", { name: "Go" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("input and textarea controls drop their own ring (the group owns it)", () => {
    render(<Usage ui={Godui} />);
    for (const control of document.querySelectorAll<HTMLElement>(
      '[data-slot="input-group-control"]',
    )) {
      expect(classesOf(control)).toContain("focus-visible:ring-0");
      expect(
        classesOf(control).filter((c) => /(^|:)transition/.test(c)),
      ).toEqual([]);
    }
  });
});
