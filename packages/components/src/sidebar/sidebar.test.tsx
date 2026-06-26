import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Sidebar, type SidebarItem } from "./sidebar";

const items: SidebarItem[] = [
  { id: "home", label: "Home", href: "/" },
  {
    id: "team",
    label: "Team",
    children: [{ id: "members", label: "Members", href: "/team/members" }],
  },
];

describe("Sidebar", () => {
  it("marks the active item with aria-current", () => {
    render(<Sidebar items={items} activeId="home" />);
    expect(screen.getByRole("link", { name: /Home/ })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("expands a nested group on click", async () => {
    render(<Sidebar items={items} />);
    const group = screen.getByRole("button", { name: /Team/ });
    expect(group).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(group);
    expect(group).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: /Members/ })).toBeInTheDocument();
  });

  it("calls onNavigate with id and href", async () => {
    const onNavigate = vi.fn();
    render(<Sidebar items={items} onNavigate={onNavigate} />);
    await userEvent.click(screen.getByRole("link", { name: /Home/ }));
    expect(onNavigate).toHaveBeenCalledWith("home", "/");
  });

  it("forwards the ref and sets a displayName", () => {
    const ref = createRef<HTMLElement>();
    render(<Sidebar ref={ref} items={items} />);
    expect(ref.current?.tagName).toBe("ASIDE");
    expect(Sidebar.displayName).toBe("Sidebar");
  });
});
