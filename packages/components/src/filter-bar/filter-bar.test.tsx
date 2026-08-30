import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
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

function createFrameMount() {
  const frame = document.createElement("iframe");
  document.body.appendChild(frame);
  const frameDocument = frame.contentDocument;
  if (!frameDocument) {
    frame.remove();
    throw new Error("Expected the test iframe to have a content document");
  }
  const mount = frameDocument.createElement("div");
  frameDocument.body.appendChild(mount);
  return { frame, frameDocument, mount };
}

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

  it("uses the mounted owner document for outside clicks and Escape", async () => {
    const { frame, frameDocument, mount } = createFrameMount();
    const { unmount } = render(<FilterBar facets={facets} />, {
      container: mount,
    });
    const trigger = within(mount).getByRole("button", { name: /Status/ });

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    fireEvent.keyDown(document, { key: "Escape" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    fireEvent.keyDown(frameDocument, { key: "Escape" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await waitFor(() =>
      expect(frameDocument.querySelector('[role="listbox"]')).toBeNull(),
    );

    fireEvent.click(trigger);
    fireEvent.mouseDown(document.body);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    fireEvent.mouseDown(frameDocument.body);
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    unmount();
    frame.remove();
  });

  it("forwards the ref and sets a displayName", () => {
    const ref = createRef<HTMLDivElement>();
    render(<FilterBar ref={ref} facets={facets} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(FilterBar.displayName).toBe("FilterBar");
  });
});
