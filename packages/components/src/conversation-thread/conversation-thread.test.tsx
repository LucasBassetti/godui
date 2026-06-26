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
});
