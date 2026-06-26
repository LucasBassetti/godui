import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { DropdownMenu, type DropdownMenuItem } from "./dropdown-menu";

const makeItems = (onSelect: () => void): DropdownMenuItem[] => [
  { type: "label", label: "Account" },
  { label: "Profile", onSelect, shortcut: "⌘P" },
  { type: "separator" },
  { label: "Disabled", disabled: true },
];

describe("DropdownMenu", () => {
  it("opens on trigger click and renders items", async () => {
    render(<DropdownMenu trigger="Open" items={makeItems(() => {})} />);
    const trigger = screen.getByRole("button", { name: "Open" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("menuitem", { name: /Profile/ }),
    ).toBeInTheDocument();
  });

  it("fires onSelect and closes", async () => {
    const onSelect = vi.fn();
    render(<DropdownMenu trigger="Open" items={makeItems(onSelect)} />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    await userEvent.click(screen.getByRole("menuitem", { name: /Profile/ }));
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("closes on Escape", async () => {
    render(<DropdownMenu trigger="Open" items={makeItems(() => {})} />);
    const trigger = screen.getByRole("button", { name: "Open" });
    await userEvent.click(trigger);
    await userEvent.keyboard("{Escape}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("forwards the ref and sets a displayName", () => {
    const ref = createRef<HTMLDivElement>();
    render(<DropdownMenu ref={ref} trigger="Open" items={[]} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(DropdownMenu.displayName).toBe("DropdownMenu");
  });
});
