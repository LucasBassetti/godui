import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// canvas-confetti draws to a real canvas — stub the side effect.
vi.mock("canvas-confetti", () => ({ default: vi.fn() }));

import canvasConfetti from "canvas-confetti";
import {
  Confetti,
  ConfettiButton,
  type ConfettiHandle,
  confetti,
} from "./confetti";

beforeEach(() => {
  vi.mocked(canvasConfetti).mockClear();
});

describe("confetti", () => {
  it("fires the burst from the direct call", () => {
    confetti({ particleCount: 10 });
    expect(canvasConfetti).toHaveBeenCalledOnce();
  });

  it("fires from the imperative ref handle", () => {
    const ref = createRef<ConfettiHandle>();
    render(<Confetti ref={ref} />);
    ref.current?.fire();
    expect(canvasConfetti).toHaveBeenCalledOnce();
  });

  it("ConfettiButton bursts on click and forwards onClick", async () => {
    const onClick = vi.fn();
    render(<ConfettiButton onClick={onClick}>Go</ConfettiButton>);
    await userEvent.click(screen.getByRole("button", { name: "Go" }));
    expect(canvasConfetti).toHaveBeenCalledOnce();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("sets displayNames", () => {
    expect(Confetti.displayName).toBe("Confetti");
    expect(ConfettiButton.displayName).toBe("ConfettiButton");
  });
});
