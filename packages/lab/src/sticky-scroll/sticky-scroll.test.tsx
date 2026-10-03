import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { StickyScroll, type StickyScrollItem } from "./sticky-scroll";

const items: StickyScrollItem[] = [
  {
    title: "Collaborate",
    description: "Work together.",
    content: <div>one</div>,
  },
  { title: "Ship", description: "Deploy fast.", content: <div>two</div> },
  { title: "Scale", description: "Grow calmly.", content: <div>three</div> },
];

function getRoot(container: HTMLElement) {
  return container.querySelector<HTMLElement>(
    '[data-slot="sticky-scroll"]',
  ) as HTMLElement;
}

describe("StickyScroll", () => {
  it("renders a title per item", () => {
    const { getByText } = render(<StickyScroll items={items} />);
    for (const item of items) {
      expect(getByText(item.title)).toBeInTheDocument();
    }
  });

  it("forwards the ref and sets a displayName", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<StickyScroll ref={ref} items={items} />);
    expect(ref.current).toBe(getRoot(container));
    expect(StickyScroll.displayName).toBe("StickyScroll");
  });
});
