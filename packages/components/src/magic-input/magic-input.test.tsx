import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { MagicInput } from "./magic-input";

describe("MagicInput", () => {
  it("renders an input", () => {
    render(<MagicInput placeholder="Type here" />);
    expect(screen.getByPlaceholderText("Type here")).toBeInTheDocument();
  });

  it("forwards the ref to the inner input element", () => {
    const ref = createRef<HTMLInputElement>();
    render(<MagicInput ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("sets a displayName", () => {
    expect(MagicInput.displayName).toBe("MagicInput");
  });

  it("reflects variant / depth / rainbow on the wrapper", () => {
    const { container } = render(
      <MagicInput variant="secondary" depth="always" rainbow={false} />,
    );
    const wrapper = container.querySelector(".magic-input");
    expect(wrapper).toHaveAttribute("data-variant", "secondary");
    expect(wrapper).toHaveAttribute("data-depth", "always");
    expect(wrapper).not.toHaveAttribute("data-rainbow");
  });

  it("maps size to the front size class", () => {
    const { container } = render(<MagicInput size="sm" />);
    expect(container.querySelector(".magic-input-front--sm")).not.toBeNull();
  });

  it("lets the user type", async () => {
    render(<MagicInput />);
    const input = screen.getByRole("textbox");
    await userEvent.type(input, "hello");
    expect(input).toHaveValue("hello");
  });

  it("shows a submit button when onSubmit is provided", () => {
    const { container } = render(<MagicInput onSubmit={vi.fn()} />);
    expect(container.querySelector(".magic-input")).toHaveAttribute(
      "data-submit",
      "true",
    );
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("calls onSubmit with the value when the button is clicked", async () => {
    const onSubmit = vi.fn();
    render(<MagicInput onSubmit={onSubmit} submitLabel="Send" />);
    await userEvent.type(screen.getByRole("textbox"), "query");
    await userEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(onSubmit).toHaveBeenCalledWith("query");
  });

  it("calls onSubmit on Enter while idle", async () => {
    const onSubmit = vi.fn();
    render(<MagicInput onSubmit={onSubmit} />);
    const input = screen.getByRole("textbox");
    await userEvent.type(input, "go{Enter}");
    expect(onSubmit).toHaveBeenCalledWith("go");
  });

  it("exposes a progressbar with status while loading", () => {
    render(<MagicInput status="loading" progress={40} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "40");
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-busy", "true");
  });

  it("does not submit while not idle", async () => {
    const onSubmit = vi.fn();
    render(<MagicInput status="loading" onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
