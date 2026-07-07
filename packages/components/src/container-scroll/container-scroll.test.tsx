import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { ContainerScroll } from "./container-scroll";

function getRoot(container: HTMLElement) {
  return container.querySelector<HTMLElement>(
    '[data-slot="container-scroll"]',
  ) as HTMLElement;
}

describe("ContainerScroll", () => {
  it("renders its screen content", () => {
    const { getByAltText } = render(
      <ContainerScroll>
        <img src="/screen.png" alt="Dashboard" />
      </ContainerScroll>,
    );
    expect(getByAltText("Dashboard")).toBeInTheDocument();
  });

  it("renders a custom header", () => {
    const { getByText } = render(
      <ContainerScroll header={<h2>Ship faster</h2>}>
        <div>screen</div>
      </ContainerScroll>,
    );
    expect(getByText("Ship faster")).toBeInTheDocument();
  });

  it("forwards the ref and sets a displayName", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <ContainerScroll ref={ref}>
        <div>screen</div>
      </ContainerScroll>,
    );
    expect(ref.current).toBe(getRoot(container));
    expect(ContainerScroll.displayName).toBe("ContainerScroll");
  });
});
