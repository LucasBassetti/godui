import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { EncryptedCard } from "./encrypted-card";

function getRoot(container: HTMLElement) {
  return container.querySelector<HTMLElement>(
    '[data-slot="encrypted-card"]',
  ) as HTMLElement;
}

describe("EncryptedCard", () => {
  it("renders its children", () => {
    const { container } = render(<EncryptedCard>Body</EncryptedCard>);
    expect(getRoot(container).textContent).toContain("Body");
  });

  it("forwards the ref to the root element", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<EncryptedCard ref={ref}>x</EncryptedCard>);
    expect(ref.current).toBe(getRoot(container));
  });

  it("renders an aria-hidden stream layer", () => {
    const { container } = render(<EncryptedCard>x</EncryptedCard>);
    expect(getRoot(container).querySelector("[aria-hidden]")).not.toBeNull();
  });

  it("sets the reveal radius CSS variable from the prop", () => {
    const { container } = render(
      <EncryptedCard revealRadius={200}>x</EncryptedCard>,
    );
    expect(getRoot(container).style.getPropertyValue("--reveal")).toBe("200px");
  });

  it("merges a custom className and sets a displayName", () => {
    const { container } = render(
      <EncryptedCard className="custom">x</EncryptedCard>,
    );
    expect(getRoot(container)).toHaveClass("custom");
    expect(EncryptedCard.displayName).toBe("EncryptedCard");
  });
});
