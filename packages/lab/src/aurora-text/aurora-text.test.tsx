import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { AuroraText } from "./aurora-text";

describe("AuroraText", () => {
  it("renders the text content", () => {
    const { container } = render(<AuroraText>Aurora</AuroraText>);
    const root = container.querySelector("[data-slot='aurora-text']");
    expect(root?.textContent).toBe("AuroraAurora");
  });

  it("exposes the text once to assistive tech and hides the animated copy", () => {
    const { container } = render(<AuroraText>Aurora</AuroraText>);
    expect(container.querySelector(".sr-only")?.textContent).toBe("Aurora");
    expect(container.querySelector("[aria-hidden='true']")?.textContent).toBe(
      "Aurora",
    );
  });

  it("builds a gradient from custom colors, looping back to the first stop", () => {
    const { container } = render(
      <AuroraText colors={["#ff0000", "#00ff00"]}>Hi</AuroraText>,
    );
    const animated = container.querySelector<HTMLSpanElement>(
      "[aria-hidden='true']",
    );
    expect(animated?.style.backgroundImage).toContain("#ff0000");
    expect(animated?.style.backgroundImage).toContain("#00ff00");
    // first stop repeated at the end for a seamless cycle
    expect(animated?.style.backgroundImage.match(/#ff0000/g)).toHaveLength(2);
  });

  it("maps the speed prop to the animation duration var", () => {
    const { container } = render(<AuroraText speed={2}>Hi</AuroraText>);
    const animated = container.querySelector<HTMLSpanElement>(
      "[aria-hidden='true']",
    );
    expect(animated?.style.getPropertyValue("--aurora-text-speed")).toBe("5s");
  });

  it("forwards the ref to the root span", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<AuroraText ref={ref}>Hi</AuroraText>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});
