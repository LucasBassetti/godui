import { render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { type CommandGroup, CommandPalette } from "./command-palette";

const groups: CommandGroup[] = [
  {
    items: [{ id: "home", label: "Go home" }],
  },
];

function createFrameMount() {
  const frameDocument = document.implementation.createHTMLDocument("preview");
  const mount = frameDocument.createElement("div");
  frameDocument.body.appendChild(mount);
  return { frameDocument, mount };
}

describe("CommandPalette", () => {
  it("uses the owner document for its portal, listeners, and body lock", async () => {
    const { frameDocument, mount } = createFrameMount();
    const onOpenChange = vi.fn();
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
    expect(document.body.style.overflow).toBe("");

    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", ctrlKey: true }),
    );
    expect(onOpenChange).not.toHaveBeenCalled();

    frameDocument.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", ctrlKey: true }),
    );
    expect(onOpenChange).toHaveBeenCalledWith(false);

    unmount();
    expect(frameDocument.body.style.overflow).toBe("");
  });
});
