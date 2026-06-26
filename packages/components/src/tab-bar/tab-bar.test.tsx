import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { TabBar, type TabBarTab } from "./tab-bar";

const dot = <span data-testid="icon" />;
const tabs: TabBarTab[] = [
  { value: "home", label: "Home", icon: dot },
  { value: "search", label: "Search", icon: dot },
  { value: "profile", label: "Profile", icon: dot, badge: 3 },
];

describe("TabBar", () => {
  it("activates the first tab by default", () => {
    render(<TabBar tabs={tabs} />);
    expect(screen.getByRole("button", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("honors defaultValue and fires onChange", async () => {
    const onChange = vi.fn();
    render(<TabBar tabs={tabs} defaultValue="search" onChange={onChange} />);
    expect(screen.getByRole("button", { name: "Search" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await userEvent.click(screen.getByRole("button", { name: "Profile" }));
    expect(onChange).toHaveBeenCalledWith("profile");
  });

  it("forwards the ref and sets a displayName", () => {
    const ref = createRef<HTMLElement>();
    render(<TabBar ref={ref} tabs={tabs} />);
    expect(ref.current?.tagName).toBe("NAV");
    expect(TabBar.displayName).toBe("TabBar");
  });
});
