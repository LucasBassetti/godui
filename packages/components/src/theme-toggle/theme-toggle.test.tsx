import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "./theme-toggle";

afterEach(() => {
  document.documentElement.classList.remove("dark");
});

describe("ThemeToggle", () => {
  it("renders an accessible toggle button", () => {
    render(<ThemeToggle />);
    expect(
      screen.getByRole("button", { name: "Toggle theme" }),
    ).toBeInTheDocument();
  });

  it("toggles the dark class and reports the next theme", async () => {
    const onThemeChange = vi.fn();
    render(<ThemeToggle onThemeChange={onThemeChange} />);
    const button = screen.getByRole("button");

    await userEvent.click(button);
    expect(document.documentElement).toHaveClass("dark");
    expect(onThemeChange).toHaveBeenLastCalledWith("dark");
    expect(button).toHaveAttribute("aria-pressed", "true");

    await userEvent.click(button);
    expect(document.documentElement).not.toHaveClass("dark");
    expect(onThemeChange).toHaveBeenLastCalledWith("light");
  });

  it("forwards the ref and sets a displayName", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<ThemeToggle ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ThemeToggle.displayName).toBe("ThemeToggle");
  });
});
