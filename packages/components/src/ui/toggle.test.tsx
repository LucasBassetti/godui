import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectSlotParity, slotTree } from "../../test/parity";
import * as Shadcn from "../../test/shadcn/toggle";
import * as Godui from "./toggle";

function Usage({ ui }: { ui: typeof Shadcn }) {
  const { Toggle } = ui;
  return (
    <div>
      <Toggle aria-label="Toggle italic">I</Toggle>
      <Toggle variant="outline" size="sm" aria-label="Toggle bold">
        B
      </Toggle>
    </div>
  );
}

const italic = () => screen.getByRole("button", { name: "Toggle italic" });

describe("Toggle", () => {
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

  it("toggles on click", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    await user.click(italic());
    expect(italic()).toHaveAttribute("data-state", "on");
  });

  it("presses on a spring, without paint transitions", () => {
    render(<Usage ui={Godui} />);
    const cls = italic().className;
    expect(cls).toContain("active:scale-[0.96]");
    expect(cls).toContain("motion-reduce:transition-none");
    expect(cls).not.toContain("transition-[color");
  });

  it("standalone Toggle keeps its on background; only a ready group hides it", () => {
    render(<Usage ui={Godui} />);
    const cls = italic().className;
    expect(cls).toContain(
      "not-in-[[data-slot=toggle-group][data-indicator=ready]]:data-[state=on]:bg-accent",
    );
    expect(cls).not.toMatch(/(^|\s)data-\[state=on\]:bg-accent/);
  });
});
