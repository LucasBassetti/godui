import { fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { type CommandGroup, CommandPalette } from "./command-palette";

const groups: CommandGroup[] = [
  {
    items: [{ id: "home", label: "Go home" }],
  },
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

describe("CommandPalette", () => {
  it("uses the owner document for its portal, listeners, and body lock", async () => {
    const { frame, frameDocument, mount } = createFrameMount();
    const onOpenChange = vi.fn();
    const parentOverflow = document.body.style.overflow;
    const { unmount } = render(
      <CommandPalette
        open
        onOpenChange={onOpenChange}
        groups={groups}
        enableShortcut
      />,
      { container: mount },
    );

    await waitFor(() => {
      expect(
        frameDocument.body.querySelector('[data-slot="command-palette"]'),
      ).toBeTruthy();
    });

    expect(
      document.body.querySelector('[data-slot="command-palette"]'),
    ).toBeNull();
    expect(frameDocument.body.style.overflow).toBe("hidden");
    expect(document.body.style.overflow).toBe(parentOverflow);

    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", ctrlKey: true }),
    );
    expect(onOpenChange).not.toHaveBeenCalled();

    frameDocument.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", ctrlKey: true }),
    );
    expect(onOpenChange).toHaveBeenCalledWith(false);

    onOpenChange.mockClear();
    fireEvent.click(document.body);
    expect(onOpenChange).not.toHaveBeenCalled();

    const backdrop = frameDocument.body.querySelector<HTMLElement>(
      '[data-slot="command-palette"]',
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
