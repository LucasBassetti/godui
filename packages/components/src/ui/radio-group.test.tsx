import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
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
    expect(indicator?.className).toContain(
      "group-data-[animate=true]/radio-group-item:data-[state=checked]:animate-godui-fade-scale-in",
    );
    expect(indicator?.className).toContain("[--godui-enter-scale:0.3]");
  });

  it("does not pop on first paint", () => {
    const { unmount } = render(<Usage ui={Godui} />);
    const item = screen.getByRole("radio", { name: "comfortable" });
    expect(item).toHaveAttribute("data-state", "checked");
    expect(item).not.toHaveAttribute("data-animate");
    // The dot's keyframe is gated on data-animate, never applied bare.
    const indicator = item.querySelector('[data-slot="radio-group-indicator"]');
    expect(indicator?.className.split(" ")).not.toContain(
      "animate-godui-fade-scale-in",
    );
    // A remount (same value) is a first paint too.
    unmount();
    render(<Usage ui={Godui} />);
    expect(
      screen.getByRole("radio", { name: "comfortable" }),
    ).not.toHaveAttribute("data-animate");
  });

  it("pops after a change (click)", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    const compact = screen.getByRole("radio", { name: "compact" });
    await user.click(compact);
    expect(compact).toHaveAttribute("data-state", "checked");
    expect(compact).toHaveAttribute("data-animate", "true");
    expect(
      compact.querySelector('[data-slot="radio-group-indicator"]'),
    ).toBeInTheDocument();
  });

  it("pops after a controlled change", () => {
    function Controlled({ value }: { value: string }) {
      return (
        <Godui.RadioGroup value={value}>
          {["a", "b"].map((v) => (
            <Godui.RadioGroupItem key={v} value={v} aria-label={v} />
          ))}
        </Godui.RadioGroup>
      );
    }
    const { rerender } = render(<Controlled value="a" />);
    expect(screen.getByRole("radio", { name: "a" })).not.toHaveAttribute(
      "data-animate",
    );
    rerender(<Controlled value="b" />);
    expect(screen.getByRole("radio", { name: "b" })).toHaveAttribute(
      "data-animate",
      "true",
    );
  });

  it("still calls onValueChange", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    function WithHandler() {
      const [value, setValue] = React.useState("a");
      return (
        <Godui.RadioGroup
          value={value}
          onValueChange={(next) => {
            onValueChange(next);
            setValue(next);
          }}
        >
          {["a", "b"].map((v) => (
            <Godui.RadioGroupItem key={v} value={v} aria-label={v} />
          ))}
        </Godui.RadioGroup>
      );
    }
    render(<WithHandler />);
    await user.click(screen.getByRole("radio", { name: "b" }));
    expect(onValueChange).toHaveBeenCalledWith("b");
    expect(screen.getByRole("radio", { name: "b" })).toHaveAttribute(
      "data-animate",
      "true",
    );
  });
});
