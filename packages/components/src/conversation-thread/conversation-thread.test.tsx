// biome-ignore-all lint/a11y/useValidAriaRole: "role" is a chat-message domain prop, not an ARIA role
import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  ConversationMessage,
  ConversationThread,
  StreamingText,
} from "./conversation-thread";

describe("ConversationThread", () => {
  it("forwards ref and reflects the variant", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<ConversationThread ref={ref} variant="document" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.getAttribute("data-variant")).toBe("document");
  });

  it("renders messages with their role attribute", () => {
    render(
      <ConversationThread>
        <ConversationMessage role="user">Hi</ConversationMessage>
        <ConversationMessage role="assistant">Hello</ConversationMessage>
      </ConversationThread>,
    );
    const messages = document.querySelectorAll(
      '[data-slot="conversation-message"]',
    );
    expect(messages).toHaveLength(2);
    expect(messages[0].getAttribute("data-role")).toBe("user");
  });

  it("renders message actions and fires their handlers", () => {
    const onClick = vi.fn();
    render(
      <ConversationMessage
        role="assistant"
        actions={[{ label: "Copy", icon: <span>c</span>, onClick }]}
      >
        Answer
      </ConversationMessage>,
    );
    screen.getByLabelText("Copy").click();
    expect(onClick).toHaveBeenCalled();
  });

  it("StreamingText reveals text over time", () => {
    vi.useFakeTimers();
    const onDone = vi.fn();
    render(<StreamingText text="abcd" chunk={2} speed={10} onDone={onDone} />);
    act(() => {
      vi.advanceTimersByTime(30);
    });
    expect(onDone).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it.each([
    0,
    -1,
    Number.NaN,
    Number.NEGATIVE_INFINITY,
  ])("StreamingText normalizes invalid chunk %s", (chunk) => {
    vi.useFakeTimers();
    const onDone = vi.fn();
    const { container } = render(
      <StreamingText text="abcd" chunk={chunk} speed={1} onDone={onDone} />,
    );
    act(() => {
      vi.advanceTimersByTime(64);
    });
    expect(container.textContent).toBe("abcd");
    expect(onDone).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it.each([
    0,
    -1,
    Number.NaN,
    Number.POSITIVE_INFINITY,
  ])("StreamingText normalizes invalid speed %s", (speed) => {
    vi.useFakeTimers();
    const setIntervalSpy = vi.spyOn(globalThis, "setInterval");
    const onDone = vi.fn();
    const { container } = render(
      <StreamingText text="abcd" chunk={2} speed={speed} onDone={onDone} />,
    );
    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 1);
    act(() => {
      vi.advanceTimersByTime(32);
    });
    expect(container.textContent).toBe("abcd");
    expect(onDone).toHaveBeenCalledTimes(1);
    setIntervalSpy.mockRestore();
    vi.useRealTimers();
  });

  it("StreamingText completes empty text without scheduling a timer", () => {
    vi.useFakeTimers();
    const onDone = vi.fn();
    const { container } = render(<StreamingText text="" onDone={onDone} />);
    expect(container.textContent).toBe("");
    expect(onDone).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
    vi.useRealTimers();
  });
});
