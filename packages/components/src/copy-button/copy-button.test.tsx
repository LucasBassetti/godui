import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CopyButton } from "./copy-button";

describe("CopyButton", () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn(() => Promise.resolve()) },
    });
  });
  afterEach(() => vi.restoreAllMocks());

  it("renders its label", () => {
    render(<CopyButton value="hi">Copy</CopyButton>);
    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
  });

  it("falls back to an aria-label when icon-only", () => {
    render(<CopyButton value="hi" />);
    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
  });

  it("forwards the ref to the button element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<CopyButton ref={ref} value="hi" />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("sets a displayName", () => {
    expect(CopyButton.displayName).toBe("CopyButton");
  });

  it("writes the value to the clipboard and fires onCopy", async () => {
    const onCopy = vi.fn();
    render(
      <CopyButton value="secret" onCopy={onCopy}>
        Copy
      </CopyButton>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("secret");
    await waitFor(() => expect(onCopy).toHaveBeenCalledWith("secret"));
  });

  it("enters the copied status after a successful copy", async () => {
    render(<CopyButton value="x">Copy</CopyButton>);
    const button = screen.getByRole("button");
    await userEvent.click(button);
    await waitFor(() =>
      expect(button).toHaveAttribute("data-status", "copied"),
    );
  });

  it("merges a custom className", () => {
    render(
      <CopyButton value="x" className="custom">
        Copy
      </CopyButton>,
    );
    expect(screen.getByRole("button")).toHaveClass("custom");
  });
});
