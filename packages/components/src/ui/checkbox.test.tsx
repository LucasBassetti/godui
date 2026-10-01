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

  it("presses on a spring and drops the shadow transition", () => {
    render(<Usage ui={Godui} />);
    const cls = box().className;
    expect(cls).toContain("active:scale-[0.92]");
    expect(cls).toContain("transition-[scale]");
    expect(cls).toContain("motion-reduce:transition-none");
    expect(cls).not.toContain("transition-shadow");
  });

  it("pops the check in from half size", () => {
    render(<Usage ui={Godui} />);
    const indicator = document.querySelector(
      '[data-slot="checkbox-indicator"]',
    );
    expect(indicator?.className).toContain("animate-godui-fade-scale-in");
    expect(indicator?.className).toContain("[--godui-enter-scale:0.5]");
  });
});
