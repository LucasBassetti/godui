import { act, render, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ToastProvider, toast } from "./toast";

function createFrameMount() {
  const frameDocument = document.implementation.createHTMLDocument("preview");
  const mount = frameDocument.createElement("div");
  frameDocument.body.appendChild(mount);
  return { frameDocument, mount };
}

describe("ToastProvider", () => {
  it("portals the toaster into the owner document", async () => {
    const { frameDocument, mount } = createFrameMount();
    const { unmount } = render(<ToastProvider duration={60_000} />, {
      container: mount,
    });

    await waitFor(() => {
      expect(
        frameDocument.body.querySelector('[data-slot="toaster"]'),
      ).toBeTruthy();
    });

    let id = 0;
    act(() => {
      id = toast({ title: "Saved", duration: 60_000 });
    });

    await waitFor(() => {
      expect(
        frameDocument.body.querySelector('[data-slot="toast"]'),
      ).toBeTruthy();
    });

    expect(document.body.querySelector('[data-slot="toaster"]')).toBeNull();
    act(() => {
      toast.dismiss(id);
    });
    unmount();
  });
});
