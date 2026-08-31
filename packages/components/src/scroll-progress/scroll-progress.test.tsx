import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ScrollProgress } from "./scroll-progress";

afterEach(() => {
  vi.restoreAllMocks();
});

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

  it("forwards circle props and its div ref to the root", async () => {
    const ref = createRef<HTMLDivElement>();
    const onClick = vi.fn();
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});

    render(
      <ScrollProgress
        ref={ref}
        variant="circle"
        showAfter={-1}
        data-testid="circle-progress"
        aria-describedby="progress-description"
        onClick={onClick}
      />,
    );

    const button = await screen.findByRole("button", { name: "Back to top" });
    const root = screen.getByTestId("circle-progress");

    expect(root).toBe(ref.current);
    expect(root).toBeInstanceOf(HTMLDivElement);
    expect(root).toHaveAttribute("aria-describedby", "progress-description");

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("scrolls the supplied container to the top for the circle variant", async () => {
    const containerRef = createRef<HTMLDivElement>();
    const containerScrollTo = vi.fn();
    const ancestorScrollTo = vi.fn();
    const windowScrollTo = vi
      .spyOn(window, "scrollTo")
      .mockImplementation(() => {});

    render(
      <div data-scroll-container>
        <div ref={containerRef}>
          <ScrollProgress
            variant="circle"
            container={containerRef}
            // Reveal the control without needing to simulate the scroll observer.
            showAfter={-1}
          />
        </div>
      </div>,
    );

    const container = containerRef.current;
    if (!container) throw new Error("Expected the container ref to be set");
    const ancestor = container.parentElement;
    if (!ancestor) throw new Error("Expected the ancestor to be set");
    Object.defineProperty(container, "scrollTo", { value: containerScrollTo });
    Object.defineProperty(ancestor, "scrollTo", { value: ancestorScrollTo });

    fireEvent.click(await screen.findByRole("button", { name: "Back to top" }));

    expect(containerScrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
    expect(ancestorScrollTo).not.toHaveBeenCalled();
    expect(windowScrollTo).not.toHaveBeenCalled();
  });

  it("forwards the ref and sets a displayName", () => {
    const ref = createRef<HTMLDivElement>();
    render(<ScrollProgress ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ScrollProgress.displayName).toBe("ScrollProgress");
  });
});
