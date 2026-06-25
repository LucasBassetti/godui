import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Accordion } from "./accordion";

const items = [
  { value: "a", title: "First", content: "First content" },
  { value: "b", title: "Second", content: "Second content" },
];

describe("Accordion", () => {
  it("expands a panel on trigger click", async () => {
    render(<Accordion items={items} />);
    const trigger = screen.getByRole("button", { name: "First" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("keeps only one open in single mode", async () => {
    render(<Accordion items={items} type="single" defaultValue="a" />);
    await userEvent.click(screen.getByRole("button", { name: "Second" }));
    expect(screen.getByRole("button", { name: "First" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getByRole("button", { name: "Second" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("allows multiple open panels in multiple mode", async () => {
    render(<Accordion items={items} type="multiple" />);
    await userEvent.click(screen.getByRole("button", { name: "First" }));
    await userEvent.click(screen.getByRole("button", { name: "Second" }));
    expect(screen.getByRole("button", { name: "First" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByRole("button", { name: "Second" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("forwards the ref and sets a displayName", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Accordion ref={ref} items={items} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(Accordion.displayName).toBe("Accordion");
  });
});
