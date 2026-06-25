import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { OTPInput } from "./otp-input";

describe("OTPInput", () => {
  it("renders one cell per length plus an accessible input", () => {
    render(<OTPInput length={4} />);
    expect(screen.getByLabelText("One-time code")).toBeInTheDocument();
  });

  it("only accepts numeric characters by default and fires onComplete", async () => {
    const onChange = vi.fn();
    const onComplete = vi.fn();
    render(<OTPInput length={4} onChange={onChange} onComplete={onComplete} />);
    const input = screen.getByLabelText("One-time code");

    await userEvent.type(input, "12a34");
    expect(input).toHaveValue("1234");
    expect(onComplete).toHaveBeenCalledWith("1234");
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("clamps the value to the configured length", async () => {
    render(<OTPInput length={3} />);
    const input = screen.getByLabelText("One-time code");
    await userEvent.type(input, "999999");
    expect(input).toHaveValue("999");
  });

  it("forwards the ref and sets a displayName", () => {
    const ref = createRef<HTMLInputElement>();
    render(<OTPInput ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(OTPInput.displayName).toBe("OTPInput");
  });
});
