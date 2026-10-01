import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { ImageCompare } from "./image-compare";

describe("ImageCompare", () => {
  it("renders an accessible slider with the initial position", () => {
    render(<ImageCompare before={<div />} after={<div />} initial={40} />);
    const slider = screen.getByRole("slider", { name: "Comparison position" });
    expect(slider).toHaveAttribute("aria-valuenow", "40");
  });

  it("moves the position with arrow keys", async () => {
    const onChange = vi.fn();
    render(
      <ImageCompare
        before={<div />}
        after={<div />}
        initial={50}
        onChange={onChange}
      />,
    );
    const slider = screen.getByRole("slider");
    slider.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenLastCalledWith(52);
    await userEvent.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(onChange).toHaveBeenLastCalledWith(48);
  });

  it("forwards the ref and sets a displayName", () => {
    const ref = createRef<HTMLDivElement>();
    render(<ImageCompare ref={ref} before={<div />} after={<div />} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ImageCompare.displayName).toBe("ImageCompare");
  });
});
