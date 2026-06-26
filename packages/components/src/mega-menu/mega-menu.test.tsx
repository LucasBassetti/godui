import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { MegaMenu, type MegaMenuItem } from "./mega-menu";

const items: MegaMenuItem[] = [
  {
    label: "Products",
    sections: [
      {
        heading: "Build",
        links: [
          { label: "Editor", href: "/editor", description: "Write code" },
          { label: "Deploy", href: "/deploy" },
        ],
      },
    ],
  },
  { label: "Pricing", href: "/pricing" },
];

describe("MegaMenu", () => {
  it("opens the panel on hover and shows links", async () => {
    render(<MegaMenu items={items} openDelay={0} />);
    await userEvent.hover(screen.getByRole("button", { name: "Products" }));
    await waitFor(() =>
      expect(screen.getByRole("link", { name: /Editor/ })).toBeInTheDocument(),
    );
  });

  it("renders a plain link for items without sections", () => {
    render(<MegaMenu items={items} />);
    expect(screen.getByRole("link", { name: "Pricing" })).toHaveAttribute(
      "href",
      "/pricing",
    );
  });

  it("calls onNavigate when a panel link is clicked", async () => {
    const onNavigate = vi.fn();
    render(<MegaMenu items={items} openDelay={0} onNavigate={onNavigate} />);
    await userEvent.hover(screen.getByRole("button", { name: "Products" }));
    const link = await screen.findByRole("link", { name: /Editor/ });
    await userEvent.click(link);
    expect(onNavigate).toHaveBeenCalledWith("/editor");
  });

  it("forwards the ref and sets a displayName", () => {
    const ref = createRef<HTMLElement>();
    render(<MegaMenu ref={ref} items={items} />);
    expect(ref.current?.tagName).toBe("NAV");
    expect(MegaMenu.displayName).toBe("MegaMenu");
  });
});
