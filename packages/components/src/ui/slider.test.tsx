import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectSlotParity, slotTree } from "../../test/parity";
import * as Shadcn from "../../test/shadcn/slider";
import * as Godui from "./slider";

function Usage({ ui }: { ui: typeof Shadcn }) {
  const { Slider } = ui;
  return (
    <div>
      <Slider defaultValue={[50]} max={100} step={1} aria-label="Volume" />
      <Slider defaultValue={[25, 75]} max={100} step={5} aria-label="Range" />
    </div>
  );
}

describe("Slider", () => {
  it("matches shadcn's data-slot tree (one thumb per value) and exports", () => {
    const { unmount } = render(<Usage ui={Shadcn} />);
    const expected = slotTree();
    unmount();
    render(<Usage ui={Godui} />);
    expectSlotParity(slotTree(), expected);
    expect(
      document.querySelectorAll('[data-slot="slider-thumb"]'),
    ).toHaveLength(3);
    expect(Object.keys(Godui)).toEqual(
      expect.arrayContaining(Object.keys(Shadcn)),
    );
  });

  it("steps with the arrow keys", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    const thumb = screen.getAllByRole("slider")[0];
    thumb.focus();
    await user.keyboard("{ArrowRight}");
    expect(thumb).toHaveAttribute("aria-valuenow", "51");
  });

  it("grows the held thumb on a spring; rings snap", () => {
    render(<Usage ui={Godui} />);
    const cls = screen.getAllByRole("slider")[0].className;
    expect(cls).toContain("active:scale-[1.15]");
    expect(cls).toContain("transition-[scale]");
    expect(cls).toContain("motion-reduce:transition-none");
    expect(cls).not.toContain("transition-[color");
  });
});
