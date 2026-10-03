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

  it("floods, draws and drains — only after a change, never on first paint", async () => {
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
    const parts = () => {
      const indicator = el.querySelector<HTMLElement>(
        '[data-slot="checkbox-indicator"]',
      );
      const [disc, window] = [...(indicator?.children ?? [])] as HTMLElement[];
      return { indicator, disc, window, mark: window?.firstElementChild };
    };
    // Pre-checked: nothing animates on load.
    expect(el).not.toHaveAttribute("data-animate");
    await user.click(el); // uncheck
    await user.click(el); // check again
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
    expect(el).toHaveAttribute("data-animate", "true");
    expect(el.className).toContain(
      "data-[animate=true]:data-[state=checked]:animate-godui-pop",
    );
    const IN =
      "group-data-[animate=true]/checkbox:group-data-[state=checked]/checkbox:";
    const OUT =
      "group-data-[animate=true]/checkbox:group-data-[state=unchecked]/checkbox:";
    const { indicator, disc, window, mark } = parts();
    expect(disc.className).toContain(`${IN}animate-godui-checkbox-fill-in`);
    expect(disc.className).toContain(`${OUT}animate-godui-checkbox-fill-out`);
    expect(window.className).toContain(`${IN}animate-godui-checkbox-draw`);
    expect(window.className).toContain(
      `${OUT}animate-godui-checkbox-check-out`,
    );
    expect(mark?.className).toContain(`${IN}animate-godui-checkbox-ink`);
    // The disc's resting scale gives it its own layer; the window must be
    // positioned or that layer paints over the mark at rest.
    expect(window.className.split(" ")).toContain("relative");
    // Presence waits on the indicator's hold before removing it; the hold is
    // gated on the unchecked state, so checking never re-adds an animation.
    expect(indicator?.className).toContain(
      "group-data-[animate=true]/checkbox:data-[state=unchecked]:animate-godui-checkbox-hold",
    );
    // No keyframe class is ever applied bare.
    for (const node of [el, indicator, disc, window, mark]) {
      for (const token of node?.className.split(/\s+/) ?? []) {
        if (token.includes("animate-godui"))
          expect(token).toMatch(/data-\[animate=true\]/);
      }
    }
  });

  it("the root's checked fill is carried by the indicator, not painted twice", () => {
    render(<Godui.Checkbox aria-label="Ink" defaultChecked />);
    const el = screen.getByRole("checkbox", { name: "Ink" });
    expect(el.className).toContain("not-data-[state=unchecked]:bg-clip-text");
    const indicator = el.querySelector('[data-slot="checkbox-indicator"]');
    expect(indicator?.className).toContain("bg-inherit");
    expect(indicator?.className).toContain("bg-clip-text");
    // It clips the disc at the border box, with the root's radius.
    expect(indicator?.className).toContain("overflow-hidden");
    expect(indicator?.className).toContain("rounded-[inherit]");
  });

  it("checked, the indicator inherits the root's colors live (no inline ink)", async () => {
    const user = userEvent.setup();
    render(<Godui.Checkbox aria-label="Drain" defaultChecked />);
    const el = screen.getByRole("checkbox", { name: "Drain" });
    const indicator = () =>
      el.querySelector<HTMLElement>('[data-slot="checkbox-indicator"]');
    expect(indicator()?.getAttribute("style") ?? "").not.toContain("color");
    // Draining keeps the checked colors inline (traced in motion-trace:
    // jsdom's computed style isn't live, so Presence can't hold it here);
    // checking again clears them.
    await user.click(el);
    await user.click(el);
    expect(indicator()?.getAttribute("style") ?? "").not.toContain("color");
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
