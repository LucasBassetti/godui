import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Terminal, type TerminalLine } from "./terminal";

const LINES: TerminalLine[] = [
  { text: "npm install @godui/components", type: "command" },
  { text: "added 1 package", type: "output" },
];

function getRoot(container: HTMLElement) {
  return container.querySelector<HTMLElement>(
    '[data-slot="terminal"]',
  ) as HTMLElement;
}

describe("Terminal", () => {
  it("renders the full transcript for assistive tech", () => {
    const { container } = render(
      <Terminal lines={LINES} startOnView={false} />,
    );
    const sr = getRoot(container).querySelector(".sr-only");
    expect(sr?.textContent).toContain("npm install @godui/components");
    expect(sr?.textContent).toContain("added 1 package");
  });

  it("forwards the ref to the root element", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <Terminal ref={ref} lines={LINES} startOnView={false} />,
    );
    expect(ref.current).toBe(getRoot(container));
  });

  it("renders window chrome by default and hides it when disabled", () => {
    const { container: withChrome } = render(
      <Terminal lines={LINES} startOnView={false} />,
    );
    expect(withChrome.querySelector(".sr-only")).not.toBeNull();
    const { container: noChrome } = render(
      <Terminal
        lines={LINES}
        startOnView={false}
        showChrome={false}
        title="x"
      />,
    );
    expect(noChrome.textContent).not.toContain("x");
  });

  it("merges a custom className and sets a displayName", () => {
    const { container } = render(
      <Terminal lines={LINES} className="custom" startOnView={false} />,
    );
    expect(getRoot(container)).toHaveClass("custom");
    expect(Terminal.displayName).toBe("Terminal");
  });
});
