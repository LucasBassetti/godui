import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
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

  it("uses the iframe owner document and viewport", () => {
    const { frame, frameDocument, mount } = createFrameMount();
    const frameWindow = frameDocument.defaultView;
    if (!frameWindow) {
      frame.remove();
      throw new Error("Expected the test iframe to have a default view");
    }
    Object.defineProperty(frameWindow, "innerWidth", {
      configurable: true,
      value: 200,
    });
    Object.defineProperty(frameWindow, "innerHeight", {
      configurable: true,
      value: 200,
    });

    const parentDocumentAdd = vi.spyOn(document, "addEventListener");
    const frameDocumentAdd = vi.spyOn(frameDocument, "addEventListener");
    const parentWindowAdd = vi.spyOn(window, "addEventListener");
    const frameWindowAdd = vi.spyOn(frameWindow, "addEventListener");
    let unmount: (() => void) | undefined;

    try {
      ({ unmount } = render(
        <ContextMenu items={items}>
          <div>Target</div>
        </ContextMenu>,
        { container: mount },
      ));
      fireEvent.contextMenu(within(mount).getByText("Target"), {
        clientX: 100,
        clientY: 80,
      });

      const menu = frameDocument.querySelector<HTMLElement>('[role="menu"]');
      expect(menu).not.toBeNull();
      expect(menu?.style.left).toBe("");
      expect(menu?.style.right).toBe("100px");
      expect(menu?.style.top).toBe("");
      expect(menu?.style.bottom).toBe("120px");

      expect(frameDocumentAdd).toHaveBeenCalledWith(
        "mousedown",
        expect.any(Function),
      );
      expect(frameDocumentAdd).toHaveBeenCalledWith(
        "keydown",
        expect.any(Function),
      );
      expect(parentDocumentAdd).not.toHaveBeenCalledWith(
        "mousedown",
        expect.any(Function),
      );
      expect(parentDocumentAdd).not.toHaveBeenCalledWith(
        "keydown",
        expect.any(Function),
      );
      expect(frameWindowAdd).toHaveBeenCalledWith(
        "scroll",
        expect.any(Function),
        true,
      );
      expect(parentWindowAdd).not.toHaveBeenCalledWith(
        "scroll",
        expect.any(Function),
        true,
      );
    } finally {
      unmount?.();
      parentDocumentAdd.mockRestore();
      frameDocumentAdd.mockRestore();
      parentWindowAdd.mockRestore();
      frameWindowAdd.mockRestore();
      frame.remove();
    }
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
