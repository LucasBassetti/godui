import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { FloatingToolbar } from "./floating-toolbar";

const actions = [
  { icon: <span>B</span>, label: "Bold" },
  { icon: <span>I</span>, label: "Italic", active: true },
];

describe("FloatingToolbar", () => {
  it("renders actions as accessible buttons when open", () => {
    render(<FloatingToolbar actions={actions} />);
    expect(screen.getByRole("button", { name: "Bold" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Italic" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("does not render when closed", () => {
    render(<FloatingToolbar actions={actions} open={false} />);
    expect(
      screen.queryByRole("button", { name: "Bold" }),
    ).not.toBeInTheDocument();
  });

  it("fires the action onClick", async () => {
    const onClick = vi.fn();
    render(
      <FloatingToolbar
        actions={[{ icon: <span>B</span>, label: "Bold", onClick }]}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Bold" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("forwards the ref and sets a displayName", () => {
    const ref = createRef<HTMLDivElement>();
    render(<FloatingToolbar ref={ref} actions={actions} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(FloatingToolbar.displayName).toBe("FloatingToolbar");
  });
});
