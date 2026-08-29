import { fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Drawer } from "./drawer";

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

describe("Drawer", () => {
  it("uses the owner document for its portal, Escape listener, and body lock", async () => {
    const { frame, frameDocument, mount } = createFrameMount();
    const onOpenChange = vi.fn();
    const parentOverflow = document.body.style.overflow;
    const { unmount } = render(
      <Drawer open onOpenChange={onOpenChange} title="Filters">
        Content
      </Drawer>,
      { container: mount },
    );

    await waitFor(() => {
      expect(
        frameDocument.body.querySelector('[data-slot="drawer"]'),
      ).toBeTruthy();
    });

    expect(document.body.querySelector('[data-slot="drawer"]')).toBeNull();
    expect(frameDocument.body.style.overflow).toBe("hidden");
    expect(document.body.style.overflow).toBe(parentOverflow);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(onOpenChange).not.toHaveBeenCalled();

    frameDocument.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape" }),
    );
    expect(onOpenChange).toHaveBeenCalledWith(false);

    onOpenChange.mockClear();
    fireEvent.click(document.body);
    expect(onOpenChange).not.toHaveBeenCalled();

    const backdrop = frameDocument.body.querySelector<HTMLElement>(
      '[data-slot="drawer"]',
    )?.previousElementSibling;
    expect(backdrop).not.toBeNull();
    fireEvent.click(backdrop as HTMLElement);
    expect(onOpenChange).toHaveBeenCalledWith(false);

    unmount();
    expect(frameDocument.body.style.overflow).toBe("");
    expect(document.body.style.overflow).toBe(parentOverflow);
    frame.remove();
  });
});
