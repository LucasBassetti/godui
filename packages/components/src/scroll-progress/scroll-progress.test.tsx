import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { ScrollProgress } from "./scroll-progress";

describe("ScrollProgress", () => {
  it("renders a progressbar for the bar variant", () => {
    render(<ScrollProgress />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("does not render the back-to-top button until scrolled (circle variant)", () => {
    render(<ScrollProgress variant="circle" />);
    expect(
      screen.queryByRole("button", { name: "Back to top" }),
    ).not.toBeInTheDocument();
  });

  it("forwards the ref and sets a displayName", () => {
    const ref = createRef<HTMLDivElement>();
    render(<ScrollProgress ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ScrollProgress.displayName).toBe("ScrollProgress");
  });
});
