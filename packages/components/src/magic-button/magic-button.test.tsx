import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { MagicButton } from "./magic-button";

describe("MagicButton", () => {
  it("renders its children", () => {
    render(<MagicButton>Click me</MagicButton>);
    expect(
      screen.getByRole("button", { name: "Click me" }),
    ).toBeInTheDocument();
  });

  it("forwards the ref to the button element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<MagicButton ref={ref}>Ref</MagicButton>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("sets a displayName", () => {
    expect(MagicButton.displayName).toBe("MagicButton");
  });

  it("reflects variant and rainbow defaults via data attributes", () => {
    render(<MagicButton>A</MagicButton>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("data-variant", "default");
    expect(button).toHaveAttribute("data-rainbow", "true");
  });

  it("applies the secondary variant and disables rainbow", () => {
    render(
      <MagicButton variant="secondary" rainbow={false}>
        A
      </MagicButton>,
    );
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("data-variant", "secondary");
    expect(button).not.toHaveAttribute("data-rainbow");
  });

  it("creates its visibility observer in the portaled document's realm", () => {
    const parentObserver = vi.fn();
    class ParentIntersectionObserver {
      constructor() {
        parentObserver();
      }

      observe() {}
      disconnect() {}
    }
    vi.stubGlobal("IntersectionObserver", ParentIntersectionObserver);

    const frame = document.createElement("iframe");
    document.body.appendChild(frame);
    const frameDocument = frame.contentDocument;
    const frameWindow = frame.contentWindow;
    if (!frameDocument || !frameWindow) {
      throw new Error("jsdom did not create an iframe document");
    }

    const frameObserve = vi.fn();
    const frameDisconnect = vi.fn();
    const frameObserver = vi.fn();
    class FrameIntersectionObserver {
      constructor() {
        frameObserver();
      }

      observe(target: Element) {
        frameObserve(target);
      }

      disconnect() {
        frameDisconnect();
      }
    }
    Object.defineProperty(frameWindow, "IntersectionObserver", {
      configurable: true,
      value: FrameIntersectionObserver,
    });

    const { container, unmount } = render(<MagicButton>Frame</MagicButton>, {
      container: frameDocument.body,
    });
    const root = container.querySelector<HTMLButtonElement>("button");

    expect(root).not.toBeNull();
    expect(frameObserver).toHaveBeenCalledOnce();
    expect(parentObserver).not.toHaveBeenCalled();
    expect(frameObserve).toHaveBeenCalledOnce();
    expect(frameObserve.mock.calls[0]?.[0]).toBe(root);

    unmount();
    expect(frameDisconnect).toHaveBeenCalledOnce();
    frame.remove();
  });

  it("maps size to the front face", () => {
    const { container } = render(<MagicButton size="lg">A</MagicButton>);
    expect(container.querySelector("[data-size='lg']")).not.toBeNull();
  });

  it("merges a custom className", () => {
    render(<MagicButton className="custom">A</MagicButton>);
    expect(screen.getByRole("button")).toHaveClass("custom");
  });

  it("fires onClick", async () => {
    const onClick = vi.fn();
    render(<MagicButton onClick={onClick}>A</MagicButton>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("toggles data-pressed on keyboard activation", async () => {
    const user = userEvent.setup();
    render(<MagicButton>A</MagicButton>);
    const button = screen.getByRole("button");
    button.focus();
    await user.keyboard("{Enter>}");
    expect(button).toHaveAttribute("data-pressed", "true");
    await user.keyboard("{/Enter}");
    expect(button).not.toHaveAttribute("data-pressed");
  });
});
