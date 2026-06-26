import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CommentPin } from "./comment-pin";

const comments = [
  {
    id: "c1",
    author: "Ana Reyes",
    body: "Can we tighten this spacing?",
    time: "2m",
  },
  { id: "c2", author: "Marco Bell", body: "Agreed, will fix." },
];

describe("CommentPin", () => {
  it("forwards ref and positions via percentages", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<CommentPin ref={ref} x={25} y={40} comments={comments} />);
    expect(ref.current?.style.left).toBe("25%");
    expect(ref.current?.style.top).toBe("40%");
  });

  it("toggles the thread open and shows comments", () => {
    render(<CommentPin x={10} y={10} comments={comments} />);
    fireEvent.click(screen.getByLabelText("Open comment thread"));
    expect(
      screen.getByText("Can we tighten this spacing?"),
    ).toBeInTheDocument();
  });

  it("fires onReply with the typed text", () => {
    const onReply = vi.fn();
    render(
      <CommentPin
        x={10}
        y={10}
        comments={comments}
        defaultOpen
        onReply={onReply}
      />,
    );
    fireEvent.change(screen.getByLabelText("Reply"), {
      target: { value: "Looks good" },
    });
    fireEvent.click(screen.getByLabelText("Send reply"));
    expect(onReply).toHaveBeenCalledWith("Looks good");
  });

  it("marks resolved pins via data attribute", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<CommentPin ref={ref} x={5} y={5} resolved comments={comments} />);
    expect(ref.current?.getAttribute("data-resolved")).toBe("");
  });
});
