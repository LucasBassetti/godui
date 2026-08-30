import { fireEvent, render, screen, within } from "@testing-library/react";
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

function createFrameMount() {
  const frame = document.createElement("iframe");
  document.body.appendChild(frame);
  const frameDocument = frame.contentDocument;
  if (!frameDocument) {
    frame.remove();
    throw new Error("Expected the test iframe to have a content document");
  }
  const mount = frameDocument.createElement("div");
  frameDocument.body.appendChild(mount);
  return { frame, frameDocument, mount };
}

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

  it("uses the mounted owner document for outside clicks", () => {
    const { frame, frameDocument, mount } = createFrameMount();
    const { unmount } = render(
      <DropdownMenu trigger="Open" items={makeItems(() => {})} />,
      { container: mount },
    );
    const trigger = within(mount).getByRole("button", { name: "Open" });

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    fireEvent.mouseDown(document.body);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    fireEvent.mouseDown(frameDocument.body);
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    unmount();
    frame.remove();
  });

  it("forwards the ref and sets a displayName", () => {
    const ref = createRef<HTMLDivElement>();
    render(<DropdownMenu ref={ref} trigger="Open" items={[]} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(DropdownMenu.displayName).toBe("DropdownMenu");
  });
});
