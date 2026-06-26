import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { type Facet, FilterBar } from "./filter-bar";

const facets: Facet[] = [
  {
    id: "status",
    label: "Status",
    options: [
      { label: "Open", value: "open", count: 12 },
      { label: "Closed", value: "closed", count: 4 },
    ],
  },
  {
    id: "type",
    label: "Type",
    options: [
      { label: "Bug", value: "bug" },
      { label: "Feature", value: "feature" },
    ],
  },
];

describe("FilterBar", () => {
  it("opens a facet popover and selects an option", async () => {
    const onChange = vi.fn();
    render(<FilterBar facets={facets} onChange={onChange} />);
    await userEvent.click(screen.getByRole("button", { name: /Status/ }));
    await userEvent.click(screen.getByRole("option", { name: /Open/ }));
    expect(onChange).toHaveBeenCalledWith({ status: ["open"] });
  });

  it("shows the active selection inline and clears the facet", async () => {
    const onChange = vi.fn();
    render(
      <FilterBar
        facets={facets}
        defaultValue={{ status: ["open"] }}
        onChange={onChange}
      />,
    );
    expect(screen.getByText("Open")).toBeInTheDocument();
    const clear = screen.getByRole("button", { name: "Clear Status" });
    await userEvent.click(clear);
    expect(onChange).toHaveBeenCalledWith({});
  });

  it("clears all filters", async () => {
    const onChange = vi.fn();
    render(
      <FilterBar
        facets={facets}
        defaultValue={{ status: ["open"], type: ["bug"] }}
        onChange={onChange}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Clear all" }));
    expect(onChange).toHaveBeenCalledWith({});
  });

  it("forwards the ref and sets a displayName", () => {
    const ref = createRef<HTMLDivElement>();
    render(<FilterBar ref={ref} facets={facets} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(FilterBar.displayName).toBe("FilterBar");
  });
});
