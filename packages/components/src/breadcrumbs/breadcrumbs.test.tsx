import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { type BreadcrumbItem, Breadcrumbs } from "./breadcrumbs";

const items: BreadcrumbItem[] = [
  { label: "Home", href: "/" },
  { label: "Library", href: "/library" },
  { label: "Data", href: "/library/data" },
  { label: "Current" },
];

describe("Breadcrumbs", () => {
  it("marks the last crumb as current page", () => {
    render(<Breadcrumbs items={items} />);
    expect(
      screen.getByText("Current").closest('[aria-current="page"]'),
    ).toBeInTheDocument();
  });

  it("collapses the middle when maxItems is exceeded", async () => {
    render(<Breadcrumbs items={items} maxItems={3} />);
    expect(screen.queryByText("Library")).not.toBeInTheDocument();
    const toggle = screen.getByRole("button", { name: /hidden crumbs/ });
    await userEvent.click(toggle);
    expect(screen.getByText("Library")).toBeInTheDocument();
  });

  it("calls onNavigate when a crumb link is clicked", async () => {
    const onNavigate = vi.fn();
    render(<Breadcrumbs items={items} onNavigate={onNavigate} />);
    await userEvent.click(screen.getByRole("link", { name: "Home" }));
    expect(onNavigate).toHaveBeenCalledWith("/");
  });

  it("forwards the ref and sets a displayName", () => {
    const ref = createRef<HTMLElement>();
    render(<Breadcrumbs ref={ref} items={items} />);
    expect(ref.current?.tagName).toBe("NAV");
    expect(Breadcrumbs.displayName).toBe("Breadcrumbs");
  });
});
