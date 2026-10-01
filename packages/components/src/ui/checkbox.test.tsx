import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectSlotParity, slotTree } from "../../test/parity";
import * as Shadcn from "../../test/shadcn/checkbox";
import * as Godui from "./checkbox";

function Usage({ ui }: { ui: typeof Shadcn }) {
  const { Checkbox } = ui;
  return (
    <div>
      <Checkbox id="terms" aria-label="Accept terms" />
      <Checkbox aria-label="Checked" defaultChecked />
      <Checkbox aria-label="Disabled" disabled />
    </div>
  );
}

const box = () => screen.getByRole("checkbox", { name: "Accept terms" });

describe("Checkbox", () => {
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

  it("toggles on click and Space", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    await user.click(box());
    expect(box()).toHaveAttribute("data-state", "checked");
    await user.keyboard(" ");
    expect(box()).toHaveAttribute("data-state", "unchecked");
  });

  it("drops the shadow transition", () => {
    render(<Usage ui={Godui} />);
    expect(box().className).not.toContain("transition-shadow");
  });

  it("pops the box and wipes the check in — only after a change, never on first paint", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Godui.Checkbox
        aria-label="Notify me"
        defaultChecked
        onCheckedChange={onCheckedChange}
      />,
    );
    const el = screen.getByRole("checkbox", { name: "Notify me" });
    // Pre-checked: nothing animates on load.
    expect(el).not.toHaveAttribute("data-animate");
    await user.click(el); // uncheck
    await user.click(el); // check again
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
    expect(el).toHaveAttribute("data-animate", "true");
    expect(el.className).toContain(
      "data-[animate=true]:data-[state=checked]:animate-godui-pop",
    );
    const wipe = el.querySelector('[data-slot="checkbox-indicator"] > span');
    expect(wipe?.className).toContain(
      "group-data-[animate=true]/checkbox:animate-godui-slide-in-from-left",
    );
  });

  it("controlled changes animate too", () => {
    const { rerender } = render(
      <Godui.Checkbox aria-label="Controlled" checked={false} />,
    );
    const el = screen.getByRole("checkbox", { name: "Controlled" });
    expect(el).not.toHaveAttribute("data-animate");
    rerender(<Godui.Checkbox aria-label="Controlled" checked />);
    expect(el).toHaveAttribute("data-animate", "true");
  });
});
