import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { VoiceButton } from "./voice-button";

describe("VoiceButton", () => {
  it("renders an accessible label when icon-only", () => {
    render(<VoiceButton />);
    expect(
      screen.getByRole("button", { name: "Record voice" }),
    ).toBeInTheDocument();
  });

  it("renders custom children", () => {
    render(<VoiceButton>Dictate</VoiceButton>);
    expect(
      screen.getByRole("button", { name: /dictate/i }),
    ).toBeInTheDocument();
  });

  it("forwards the ref to the button element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<VoiceButton ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("sets a displayName", () => {
    expect(VoiceButton.displayName).toBe("VoiceButton");
  });

  it("starts idle and not pressed", () => {
    render(<VoiceButton />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("data-status", "idle");
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("enters the denied status when mic is unavailable", async () => {
    const onDenied = vi.fn();
    render(<VoiceButton onDenied={onDenied} />);
    // jsdom has no mediaDevices/AudioContext, so a click is denied.
    await userEvent.click(screen.getByRole("button"));
    await waitFor(() =>
      expect(screen.getByRole("button")).toHaveAttribute(
        "data-status",
        "denied",
      ),
    );
    expect(onDenied).toHaveBeenCalledOnce();
  });

  it("merges a custom className", () => {
    render(<VoiceButton className="custom" />);
    expect(screen.getByRole("button")).toHaveClass("custom");
  });
});
