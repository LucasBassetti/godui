import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectSlotParity, slotTree } from "../../test/parity";
import * as Shadcn from "../../test/shadcn/radio-group";
import * as Godui from "./radio-group";

function Usage({ ui }: { ui: typeof Shadcn }) {
  const { RadioGroup, RadioGroupItem } = ui;
  return (
    <RadioGroup defaultValue="comfortable">
      {["default", "comfortable", "compact"].map((value) => (
        <RadioGroupItem key={value} value={value} aria-label={value} />
      ))}
    </RadioGroup>
  );
}

describe("RadioGroup", () => {
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

  it("arrows move focus; Space selects", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    await user.click(screen.getByRole("radio", { name: "comfortable" }));
    await user.keyboard("{ArrowDown}");
    // Radix's roving focus moves focus on a timeout. (Its select-on-focus
    // relies on browser key handling jsdom lacks — shadcn's copy behaves the same.)
    const compact = screen.getByRole("radio", { name: "compact" });
    await waitFor(() => expect(compact).toHaveFocus());
    await user.keyboard(" ");
    expect(compact).toHaveAttribute("data-state", "checked");
  });

  it("presses on a spring; the dot grows from 30%", () => {
    render(<Usage ui={Godui} />);
    const item = screen.getByRole("radio", { name: "comfortable" });
    expect(item.className).toContain("active:scale-[0.9]");
    expect(item.className).toContain("motion-reduce:transition-none");
    expect(item.className).not.toContain("transition-[color");
    const indicator = item.querySelector('[data-slot="radio-group-indicator"]');
    expect(indicator?.className).toContain("animate-godui-fade-scale-in");
    expect(indicator?.className).toContain("[--godui-enter-scale:0.3]");
  });
});
