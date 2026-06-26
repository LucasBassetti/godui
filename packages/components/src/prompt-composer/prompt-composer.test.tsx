import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PromptComposer } from "./prompt-composer";

describe("PromptComposer", () => {
  it("forwards ref to the form element", () => {
    const ref = { current: null as HTMLFormElement | null };
    render(<PromptComposer ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLFormElement);
  });

  it("reflects the variant via data attribute", () => {
    const ref = { current: null as HTMLFormElement | null };
    render(<PromptComposer ref={ref} variant="compact" />);
    expect(ref.current?.getAttribute("data-variant")).toBe("compact");
  });

  it("calls onSend with the typed value and clears it", () => {
    const onSend = vi.fn();
    render(<PromptComposer onSend={onSend} />);
    const textarea = screen.getByLabelText("Prompt") as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "hello world" } });
    fireEvent.keyDown(textarea, { key: "Enter", metaKey: true });
    expect(onSend).toHaveBeenCalledWith("hello world", []);
    expect(textarea.value).toBe("");
  });

  it("disables the send button when empty", () => {
    render(<PromptComposer />);
    expect(screen.getByLabelText("Send message")).toBeDisabled();
  });

  it("shows a stop button and calls onStop while streaming", () => {
    const onStop = vi.fn();
    render(<PromptComposer isStreaming onStop={onStop} />);
    const stop = screen.getByLabelText("Stop generating");
    fireEvent.click(stop);
    expect(onStop).toHaveBeenCalled();
  });

  it("does not submit when value is only whitespace", () => {
    const onSend = vi.fn();
    render(<PromptComposer onSend={onSend} />);
    const textarea = screen.getByLabelText("Prompt");
    fireEvent.change(textarea, { target: { value: "   " } });
    fireEvent.keyDown(textarea, { key: "Enter", ctrlKey: true });
    expect(onSend).not.toHaveBeenCalled();
  });
});
