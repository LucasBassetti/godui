import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { StackBadge, TECH } from "./stack-badge";

describe("StackBadge", () => {
  it("renders a chip per item and resolves built-in keys", () => {
    const { getByText, container } = render(
      <StackBadge items={["react", "typescript"]} />,
    );
    expect(getByText("React")).toBeInTheDocument();
    expect(getByText("TypeScript")).toBeInTheDocument();
    expect(
      container.querySelectorAll('[data-slot="stack-badge-item"]'),
    ).toHaveLength(2);
  });

  it("renders custom items with their own label and icon", () => {
    const { getByText, getByTestId } = render(
      <StackBadge
        items={[
          {
            name: "My API",
            icon: <span data-testid="logo" />,
            color: "#ff5c00",
          },
        ]}
      />,
    );
    expect(getByText("My API")).toBeInTheDocument();
    expect(getByTestId("logo")).toBeInTheDocument();
  });

  it("hides labels and exposes an accessible name when showLabel is off", () => {
    const { queryByText, getByLabelText } = render(
      <StackBadge items={["react"]} showLabel={false} />,
    );
    expect(queryByText("React")).toBeNull();
    expect(getByLabelText("React")).toBeInTheDocument();
  });

  it("marks the root and forwards the ref", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<StackBadge ref={ref} items={["go"]} />);
    expect(ref.current).not.toBeNull();
    expect(
      container.querySelector('[data-slot="stack-badge"]'),
    ).toBeInTheDocument();
    expect(StackBadge.displayName).toBe("StackBadge");
  });

  it("exposes the built-in tech registry", () => {
    expect(TECH.react.label).toBe("React");
    expect(TECH.nextjs.mono).toBe(true);
  });
});
