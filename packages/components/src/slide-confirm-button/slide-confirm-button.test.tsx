import { act, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { SlideConfirmButton } from "./slide-confirm-button";

describe("SlideConfirmButton", () => {
  it("renders the track label", () => {
    render(<SlideConfirmButton label="Slide to pay" />);
    expect(screen.getByText("Slide to pay")).toBeInTheDocument();
  });

  it("forwards the ref to the root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<SlideConfirmButton ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("sets a displayName", () => {
    expect(SlideConfirmButton.displayName).toBe("SlideConfirmButton");
  });

  it("starts in the idle status", () => {
    const { container } = render(<SlideConfirmButton />);
    expect(container.firstChild).toHaveAttribute("data-status", "idle");
  });

  it("confirms via keyboard (ArrowRight)", () => {
    const onConfirm = vi.fn();
    const { container } = render(<SlideConfirmButton onConfirm={onConfirm} />);
    const thumb = screen.getByRole("button");
    act(() => {
      thumb.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
      );
    });
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(container.firstChild).toHaveAttribute("data-status", "confirmed");
  });

  it("merges a custom className", () => {
    const { container } = render(<SlideConfirmButton className="custom" />);
    expect(container.firstChild).toHaveClass("custom");
  });

  it("shows the loading status while an async onConfirm is pending", async () => {
    let resolve!: () => void;
    const pending = new Promise<void>((r) => {
      resolve = r;
    });
    const onConfirm = vi.fn(() => pending);
    const { container } = render(
      <SlideConfirmButton onConfirm={onConfirm} loadingLabel="Saving" />,
    );
    const thumb = screen.getByRole("button");
    act(() => {
      thumb.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
      );
    });

    expect(container.firstChild).toHaveAttribute("data-status", "loading");
    expect(screen.getByText("Saving")).toBeInTheDocument();

    await act(async () => {
      resolve();
      await pending;
    });

    expect(container.firstChild).toHaveAttribute("data-status", "confirmed");
  });

  it("returns to idle when an async onConfirm rejects", async () => {
    let reject!: (reason?: unknown) => void;
    const pending = new Promise<void>((_, r) => {
      reject = r;
    });
    // Prevent the rejection from surfacing as an unhandled rejection in the
    // test runner; the component itself also swallows it.
    pending.catch(() => {});
    const onConfirm = vi.fn(() => pending);
    const { container } = render(<SlideConfirmButton onConfirm={onConfirm} />);
    const thumb = screen.getByRole("button");
    act(() => {
      thumb.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
      );
    });

    expect(container.firstChild).toHaveAttribute("data-status", "loading");

    await act(async () => {
      reject(new Error("nope"));
      await pending.catch(() => {});
    });

    expect(container.firstChild).toHaveAttribute("data-status", "idle");
  });
});
