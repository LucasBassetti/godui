import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PromptSuggestions } from "./prompt-suggestions";

const items = [
  { id: "a", label: "Summarize this thread" },
  { id: "b", label: "Draft a reply" },
];

describe("PromptSuggestions", () => {
  it("forwards ref and reflects the variant", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<PromptSuggestions ref={ref} suggestions={items} variant="chips" />);
    expect(ref.current?.getAttribute("data-variant")).toBe("chips");
  });

  it("renders one button per suggestion", () => {
    render(<PromptSuggestions suggestions={items} />);
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("calls onSelect with the chosen suggestion", () => {
    const onSelect = vi.fn();
    render(<PromptSuggestions suggestions={items} onSelect={onSelect} />);
    fireEvent.click(screen.getByText("Draft a reply"));
    expect(onSelect).toHaveBeenCalledWith(items[1]);
  });

  it("renders skeletons while loading", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <PromptSuggestions
        ref={ref}
        suggestions={items}
        loading
        skeletonCount={3}
      />,
    );
    expect(ref.current?.getAttribute("data-loading")).toBe("");
    expect(screen.queryByText("Draft a reply")).not.toBeInTheDocument();
  });
});
