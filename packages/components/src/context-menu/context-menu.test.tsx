import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { ContextMenu, type ContextMenuItem } from "./context-menu";

const items: ContextMenuItem[] = [
  { type: "label", label: "Actions" },
  { label: "Copy", shortcut: "⌘C", onSelect: () => {} },
  { type: "separator" },
  { label: "Delete", destructive: true, onSelect: () => {} },
];

describe("ContextMenu", () => {
  it("opens at the cursor on right-click", () => {
    render(
      <ContextMenu items={items}>
        <div>Right-click me</div>
      </ContextMenu>,
    );
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    fireEvent.contextMenu(screen.getByText("Right-click me"));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /Copy/ })).toBeInTheDocument();
  });

  it("fires onSelect and closes", async () => {
    const onSelect = vi.fn();
    render(
      <ContextMenu items={[{ label: "Copy", onSelect }]}>
        <div>Target</div>
      </ContextMenu>,
    );
    fireEvent.contextMenu(screen.getByText("Target"));
    await userEvent.click(screen.getByRole("menuitem", { name: "Copy" }));
    expect(onSelect).toHaveBeenCalledOnce();
    await waitFor(() =>
      expect(screen.queryByRole("menu")).not.toBeInTheDocument(),
    );
  });

  it("closes on Escape", async () => {
    render(
      <ContextMenu items={items}>
        <div>Target</div>
      </ContextMenu>,
    );
    fireEvent.contextMenu(screen.getByText("Target"));
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() =>
      expect(screen.queryByRole("menu")).not.toBeInTheDocument(),
    );
  });

  it("forwards the ref and sets a displayName", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ContextMenu ref={ref} items={items}>
        <div>Target</div>
      </ContextMenu>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ContextMenu.displayName).toBe("ContextMenu");
  });
});
