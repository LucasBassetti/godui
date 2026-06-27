import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { GooeyFab, type GooeyFabAction } from "./gooey-fab";

const actions: GooeyFabAction[] = [
  { label: "Edit", icon: <span>✎</span> },
  { label: "Share", icon: <span>↗</span> },
];

describe("GooeyFab", () => {
  it("renders the trigger", () => {
    render(<GooeyFab actions={actions} />);
    expect(
      screen.getByRole("button", { name: "Open actions" }),
    ).toBeInTheDocument();
  });

  it("forwards the ref to the root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<GooeyFab ref={ref} actions={actions} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("sets a displayName", () => {
    expect(GooeyFab.displayName).toBe("GooeyFab");
  });

  it("toggles aria-expanded and data-open on trigger click", async () => {
    render(<GooeyFab actions={actions} />);
    const trigger = screen.getByRole("button", { name: "Open actions" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("renders an accessible button per action", () => {
    render(<GooeyFab actions={actions} />);
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Share" })).toBeInTheDocument();
  });

  it("fires the action onClick and closes", async () => {
    const onClick = vi.fn();
    render(
      <GooeyFab
        actions={[{ label: "Edit", icon: <span>✎</span>, onClick }]}
        defaultOpen
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(
      screen.getByRole("button", { name: "Open actions" }),
    ).toHaveAttribute("aria-expanded", "false");
  });
});
