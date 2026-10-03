import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { ThreeDMarquee } from "./three-d-marquee";

const IMAGES = Array.from(
  { length: 12 },
  (_, i) => `https://example.com/${i}.jpg`,
);

function getRoot(container: HTMLElement) {
  return container.querySelector<HTMLElement>(
    '[data-slot="three-d-marquee"]',
  ) as HTMLElement;
}

describe("ThreeDMarquee", () => {
  it("renders an image per source", () => {
    const { container } = render(<ThreeDMarquee images={IMAGES} />);
    expect(getRoot(container).querySelectorAll("img").length).toBe(12);
  });

  it("forwards the ref and sets a displayName", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<ThreeDMarquee ref={ref} images={IMAGES} />);
    expect(ref.current).toBe(getRoot(container));
    expect(ThreeDMarquee.displayName).toBe("ThreeDMarquee");
  });
});
