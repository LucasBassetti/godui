import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { ResizableHeader } from "./resizable-header";

const links = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
];

describe("ResizableHeader", () => {
  it("renders links and marks the active one", () => {
    render(<ResizableHeader links={links} activeHref="/pricing" />);
    const active = screen.getByRole("link", { name: "Pricing" });
    expect(active).toHaveAttribute("aria-current", "page");
  });

  it("toggles the mobile menu", async () => {
    render(<ResizableHeader links={links} />);
    const toggle = screen.getByRole("button", { name: "Toggle menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
  });

  it("calls onNavigate with the link href", async () => {
    const onNavigate = vi.fn();
    render(<ResizableHeader links={links} onNavigate={onNavigate} />);
    await userEvent.click(screen.getAllByRole("link", { name: "Docs" })[0]);
    expect(onNavigate).toHaveBeenCalledWith("/docs");
  });

  it("forwards the ref and sets a displayName", () => {
    const ref = createRef<HTMLElement>();
    render(<ResizableHeader ref={ref} links={links} />);
    expect(ref.current?.tagName).toBe("HEADER");
    expect(ResizableHeader.displayName).toBe("ResizableHeader");
  });
});
