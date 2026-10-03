import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { AppShowcase } from "./app-showcase";

function getRoot(container: HTMLElement) {
  return container.querySelector<HTMLElement>(
    '[data-slot="app-showcase"]',
  ) as HTMLElement;
}

describe("AppShowcase", () => {
  it("renders the screen image", () => {
    const { getByAltText } = render(
      <AppShowcase mode="scroll" src="/screen.png" alt="Home screen" />,
    );
    expect(getByAltText("Home screen")).toBeInTheDocument();
  });

  it("reflects device and mode on the root", () => {
    const { container } = render(
      <AppShowcase device="android" mode="loop" src="/screen.png" />,
    );
    const root = getRoot(container);
    expect(root).toHaveAttribute("data-device", "android");
    expect(root).toHaveAttribute("data-mode", "loop");
  });

  it("renders dot controls for a carousel with multiple screens", () => {
    const { getAllByRole } = render(
      <AppShowcase mode="carousel" screens={["/a.png", "/b.png", "/c.png"]} />,
    );
    expect(getAllByRole("tab")).toHaveLength(3);
  });

  it("renders each phone in a cluster", () => {
    const { container } = render(
      <AppShowcase mode="cluster" screens={["/a.png", "/b.png", "/c.png"]} />,
    );
    expect(container.querySelectorAll("img")).toHaveLength(3);
  });

  it("renders a video source over the screen", () => {
    const { container } = render(
      <AppShowcase mode="scroll" videoSrc="/demo.mp4" />,
    );
    expect(container.querySelector("video")).toBeInTheDocument();
  });

  it("forwards the ref and sets a displayName", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<AppShowcase ref={ref} src="/screen.png" />);
    expect(ref.current).toBe(getRoot(container));
    expect(AppShowcase.displayName).toBe("AppShowcase");
  });
});
