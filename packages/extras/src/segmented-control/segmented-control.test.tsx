import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { SegmentedControl } from "./segmented-control";

const options = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
];

describe("SegmentedControl", () => {
  it("selects the first option by default", () => {
    render(<SegmentedControl options={options} />);
    expect(screen.getByRole("tab", { name: "Day" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("honors defaultValue and fires onChange on select", async () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl
        options={options}
        defaultValue="week"
        onChange={onChange}
      />,
    );
    expect(screen.getByRole("tab", { name: "Week" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await userEvent.click(screen.getByRole("tab", { name: "Month" }));
    expect(onChange).toHaveBeenCalledWith("month");
  });

  it("forwards the ref and sets a displayName", () => {
    const ref = createRef<HTMLDivElement>();
    render(<SegmentedControl ref={ref} options={options} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(SegmentedControl.displayName).toBe("SegmentedControl");
  });
});
