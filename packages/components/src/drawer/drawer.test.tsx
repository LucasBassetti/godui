import { render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Drawer } from "./drawer";

function createFrameMount() {
  const frameDocument = document.implementation.createHTMLDocument("preview");
  const mount = frameDocument.createElement("div");
  frameDocument.body.appendChild(mount);
  return { frameDocument, mount };
}

describe("Drawer", () => {
  it("uses the owner document for its portal, Escape listener, and body lock", async () => {
    const { frameDocument, mount } = createFrameMount();
    const onOpenChange = vi.fn();
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
    expect(document.body.style.overflow).toBe("");

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(onOpenChange).not.toHaveBeenCalled();

    frameDocument.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape" }),
    );
    expect(onOpenChange).toHaveBeenCalledWith(false);

    unmount();
    expect(frameDocument.body.style.overflow).toBe("");
  });
});
