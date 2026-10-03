import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectSlotParity, slotTree } from "../../test/parity";
import * as Shadcn from "../../test/shadcn/select";
import * as Godui from "./select";

// Radix Select reaches for pointer-capture and scrolling APIs jsdom lacks.
beforeAll(() => {
  Element.prototype.hasPointerCapture ??= () => false;
  Element.prototype.releasePointerCapture ??= () => {};
  Element.prototype.scrollIntoView ??= () => {};
});

function Usage({
  ui,
  defaultOpen,
}: {
  ui: typeof Shadcn;
  defaultOpen?: boolean;
}) {
  const {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
  } = ui;
  return (
    <Select defaultOpen={defaultOpen}>
      <SelectTrigger className="w-[180px]" aria-label="Fruit">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectItem value="grapes">Grapes</SelectItem>
      </SelectContent>
    </Select>
  );
}

const content = () =>
  document.querySelector('[data-slot="select-content"]') as HTMLElement;

describe("Select", () => {
  it("matches shadcn's data-slot tree and exports", () => {
    const { unmount } = render(<Usage ui={Shadcn} defaultOpen />);
    const expected = slotTree();
    unmount();
    render(<Usage ui={Godui} defaultOpen />);
    expectSlotParity(slotTree(), expected);
    expect(Object.keys(Godui)).toEqual(
      expect.arrayContaining(Object.keys(Shadcn)),
    );
  });

  it("opens from the keyboard and selects an item", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    screen.getByRole("combobox", { name: "Fruit" }).focus();
    await user.keyboard("{Enter}");
    await waitFor(() => expect(content()).toBeInTheDocument());
    await user.click(screen.getByRole("option", { name: "Banana" }));
    await waitFor(() =>
      expect(screen.getByRole("combobox", { name: "Fruit" })).toHaveTextContent(
        "Banana",
      ),
    );
  });

  it("content grows on a spring; the trigger doesn't transition paint", () => {
    render(<Usage ui={Godui} defaultOpen />);
    const cls = content().className;
    expect(cls).toContain("data-[state=open]:animate-godui-popover-in");
    expect(cls).toContain("data-[state=closed]:animate-godui-popover-out");
    expect(cls).not.toMatch(/animate-in|zoom-in|slide-in-from/);
    const trigger = document.querySelector('[data-slot="select-trigger"]');
    expect(trigger?.className).not.toContain("transition-[color");
  });

  it("pops the selected item's check in", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    screen.getByRole("combobox", { name: "Fruit" }).focus();
    await user.keyboard("{Enter}");
    await user.click(await screen.findByRole("option", { name: "Apple" }));
    screen.getByRole("combobox", { name: "Fruit" }).focus();
    await user.keyboard("{Enter}");
    const apple = await screen.findByRole("option", { name: "Apple" });
    const indicator = apple.querySelector("span span") as HTMLElement | null;
    expect(indicator?.className).toContain("animate-godui-fade-scale-in");
  });
});
