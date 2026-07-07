import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { HeroParallax, type HeroParallaxItem } from "./hero-parallax";

const products: HeroParallaxItem[] = Array.from({ length: 15 }, (_, i) => ({
  title: `Item ${i}`,
  thumbnail: `https://example.com/${i}.jpg`,
}));

function getRoot(container: HTMLElement) {
  return container.querySelector<HTMLElement>(
    '[data-slot="hero-parallax"]',
  ) as HTMLElement;
}

describe("HeroParallax", () => {
  it("renders a card per product image", () => {
    const { container } = render(<HeroParallax products={products} />);
    expect(getRoot(container).querySelectorAll("img").length).toBe(15);
  });

  it("renders a custom header", () => {
    const { getByText } = render(
      <HeroParallax products={products} header={<span>Custom head</span>} />,
    );
    expect(getByText("Custom head")).toBeInTheDocument();
  });

  it("forwards the ref and sets a displayName", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <HeroParallax ref={ref} products={products} />,
    );
    expect(ref.current).toBe(getRoot(container));
    expect(HeroParallax.displayName).toBe("HeroParallax");
  });
});
