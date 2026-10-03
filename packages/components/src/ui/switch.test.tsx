import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectSlotParity, slotTree } from "../../test/parity";
import * as Shadcn from "../../test/shadcn/switch";
import * as Godui from "./switch";

function Usage({ ui }: { ui: typeof Shadcn }) {
  const { Switch } = ui;
  return (
    <div>
      <Switch id="airplane-mode" aria-label="Airplane mode" />
      <Switch size="sm" aria-label="Small" defaultChecked />
    </div>
  );
}

const root = () => screen.getByRole("switch", { name: "Airplane mode" });
const thumb = () =>
  root().querySelector('[data-slot="switch-thumb"]') as HTMLElement;

describe("Switch", () => {
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
    await user.click(root());
    expect(root()).toHaveAttribute("aria-checked", "true");
    await user.keyboard(" ");
    expect(root()).toHaveAttribute("aria-checked", "false");
  });

  it("crossfades the checked color on a layer instead of painting the track", () => {
    render(<Usage ui={Godui} />);
    const cls = root().className;
    expect(cls).not.toContain("transition-all");
    expect(cls).not.toMatch(/(^|\s)data-\[state=checked\]:bg-primary/);
    expect(cls).toContain("before:bg-primary");
    expect(cls).toContain("before:transition-opacity");
    expect(cls).toContain("data-[state=checked]:before:opacity-100");
  });

  it("slides the thumb on a spring and honours reduced motion", () => {
    render(<Usage ui={Godui} />);
    const cls = thumb().className;
    expect(cls).toContain("transition-[translate]");
    expect(cls).toContain("ease-spring-snappy");
    expect(cls).toContain("motion-reduce:transition-none");
    expect(cls).not.toContain("transition-transform");
  });
});
