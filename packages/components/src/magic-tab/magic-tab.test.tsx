import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { MagicTab, type MagicTabItem } from "./magic-tab";

const items: MagicTabItem[] = [
  { value: "one", label: "One" },
  { value: "two", label: "Two" },
  { value: "three", label: "Three" },
];

describe("MagicTab", () => {
  it("renders every item as a tab", () => {
    render(<MagicTab items={items} />);
    expect(screen.getAllByRole("tab")).toHaveLength(3);
    expect(screen.getByRole("tablist")).toBeInTheDocument();
  });

  it("forwards the ref to the bar element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<MagicTab ref={ref} items={items} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("sets a displayName", () => {
    expect(MagicTab.displayName).toBe("MagicTab");
  });

  it("reflects variant and rainbow defaults via data attributes", () => {
    render(<MagicTab items={items} />);
    const tablist = screen.getByRole("tablist");
    expect(tablist).toHaveAttribute("data-variant", "default");
    expect(tablist).toHaveAttribute("data-rainbow", "true");
  });

  it("drops data-rainbow when rainbow is disabled and applies the variant", () => {
    render(<MagicTab items={items} variant="secondary" rainbow={false} />);
    const tablist = screen.getByRole("tablist");
    expect(tablist).toHaveAttribute("data-variant", "secondary");
    expect(tablist).not.toHaveAttribute("data-rainbow");
  });

  it("selects the first non-disabled item by default", () => {
    render(
      <MagicTab
        items={[
          { value: "one", label: "One", disabled: true },
          ...items.slice(1),
        ]}
      />,
    );
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("honors defaultValue when uncontrolled", () => {
    render(<MagicTab items={items} defaultValue="three" />);
    expect(screen.getByRole("tab", { name: "Three" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("changes selection on click and fires onValueChange", async () => {
    const onValueChange = vi.fn();
    render(<MagicTab items={items} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("tab", { name: "Two" }));
    expect(onValueChange).toHaveBeenCalledWith("two");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute(
      "data-selected",
      "true",
    );
  });

  it("arrows move focus without selecting; Enter commits the selection", async () => {
    const user = userEvent.setup();
    render(<MagicTab items={items} />);
    const one = screen.getByRole("tab", { name: "One" });
    one.focus();
    await user.keyboard("{ArrowRight}");
    // focus moved, selection unchanged
    expect(screen.getByRole("tab", { name: "Two" })).toHaveFocus();
    expect(one).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
    // Enter commits the focused tab
    await user.keyboard("{Enter}");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("selects the focused tab with Space", async () => {
    const user = userEvent.setup();
    render(<MagicTab items={items} />);
    screen.getByRole("tab", { name: "One" }).focus();
    await user.keyboard("{End}");
    await user.keyboard(" ");
    expect(screen.getByRole("tab", { name: "Three" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("respects a controlled value (internal state does not override)", async () => {
    function Controlled() {
      const [value, setValue] = useState("one");
      return (
        <>
          <MagicTab items={items} value={value} onValueChange={setValue} />
          <span data-testid="value">{value}</span>
        </>
      );
    }
    render(<Controlled />);
    await userEvent.click(screen.getByRole("tab", { name: "Three" }));
    expect(screen.getByTestId("value")).toHaveTextContent("three");
    expect(screen.getByRole("tab", { name: "Three" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("arrow navigation skips a disabled tab", async () => {
    const user = userEvent.setup();
    render(
      <MagicTab
        items={[
          { value: "one", label: "One" },
          { value: "two", label: "Two", disabled: true },
          { value: "three", label: "Three" },
        ]}
      />,
    );
    screen.getByRole("tab", { name: "One" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Three" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("tab", { name: "Three" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("maps size to the front face", () => {
    const { container } = render(<MagicTab items={items} size="lg" />);
    expect(container.querySelector("[data-size='lg']")).not.toBeNull();
  });

  it("merges a custom className", () => {
    render(<MagicTab items={items} className="custom" />);
    expect(screen.getByRole("tablist")).toHaveClass("custom");
  });
});
