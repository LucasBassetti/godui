import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Stepper } from "./stepper";

const steps = [
  { label: "Account" },
  { label: "Profile" },
  { label: "Confirm" },
];

describe("Stepper", () => {
  it("renders every step label", () => {
    render(<Stepper steps={steps} active={1} />);
    for (const s of steps) {
      expect(screen.getByText(s.label)).toBeInTheDocument();
    }
  });

  it("marks the active step with aria-current", () => {
    render(<Stepper steps={steps} active={1} />);
    const current = screen
      .getByText("Profile")
      .closest('[aria-current="step"]');
    expect(current).not.toBeNull();
  });

  it("forwards the ref and sets a displayName", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Stepper ref={ref} steps={steps} active={0} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(Stepper.displayName).toBe("Stepper");
  });
});
