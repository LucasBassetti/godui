import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Pagination } from "./pagination";

describe("Pagination", () => {
  it("marks the current page", () => {
    render(<Pagination total={10} defaultPage={3} />);
    expect(screen.getByRole("button", { name: "Page 3" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("disables prev on the first page and next on the last", () => {
    const { rerender } = render(<Pagination total={5} page={1} />);
    expect(
      screen.getByRole("button", { name: "Previous page" }),
    ).toBeDisabled();
    rerender(<Pagination total={5} page={5} />);
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  });

  it("fires onPageChange when a page is clicked", async () => {
    const onPageChange = vi.fn();
    render(
      <Pagination total={10} defaultPage={1} onPageChange={onPageChange} />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("truncates long ranges with ellipses", () => {
    render(<Pagination total={50} defaultPage={25} />);
    expect(screen.getAllByText("…").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "Page 1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 50" })).toBeInTheDocument();
  });

  it("forwards the ref and sets a displayName", () => {
    const ref = createRef<HTMLElement>();
    render(<Pagination ref={ref} total={3} />);
    expect(ref.current?.tagName).toBe("NAV");
    expect(Pagination.displayName).toBe("Pagination");
  });
});
