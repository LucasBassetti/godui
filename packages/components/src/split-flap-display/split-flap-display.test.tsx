import { act, fireEvent, render } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SplitFlapDisplay } from "./split-flap-display";

let intersectionCallback: IntersectionObserverCallback | undefined;

class MockIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    intersectionCallback = callback;
  }

  observe() {}
  disconnect() {}
}

function getRoot(container: HTMLElement) {
  return container.querySelector<HTMLElement>(
    '[data-slot="split-flap-display"]',
  ) as HTMLElement;
}

function flaps(container: HTMLElement) {
  return getRoot(container).querySelectorAll(":scope > [aria-hidden]");
}

function risingHalves(container: HTMLElement) {
  return Array.from(flaps(container)).flatMap((flap) => {
    const rise = flap.querySelector<HTMLElement>(".animate-split-flap-rise");
    return rise ? [rise] : [];
  });
}

afterEach(() => {
  intersectionCallback = undefined;
  vi.unstubAllGlobals();
});

describe("SplitFlapDisplay", () => {
  it("renders one flap per character of the value", () => {
    const { container } = render(<SplitFlapDisplay value="GODUI" />);
    expect(flaps(container)).toHaveLength(5);
  });

  it("pads (or truncates) to a fixed length", () => {
    const { container: padded } = render(
      <SplitFlapDisplay value="HI" length={6} />,
    );
    expect(flaps(padded)).toHaveLength(6);

    const { container: clipped } = render(
      <SplitFlapDisplay value="OVERFLOWING" length={4} />,
    );
    expect(flaps(clipped)).toHaveLength(4);
  });

  it("normalizes invalid and oversized lengths without throwing", () => {
    const cases = [
      { length: Infinity, expected: 2 },
      { length: Number.MAX_SAFE_INTEGER, expected: 100 },
      { length: Number.NaN, expected: 2 },
      { length: 2.5, expected: 2 },
      { length: -1, expected: 0 },
      { length: 0, expected: 0 },
      { length: 6, expected: 6 },
    ];

    for (const { length, expected } of cases) {
      const { container } = render(
        <SplitFlapDisplay value="HI" length={length} />,
      );
      expect(flaps(container)).toHaveLength(expected);
    }
  });

  it("preserves alignment for valid lengths", () => {
    const cases = [
      { align: "left" as const, className: "justify-start" },
      { align: "center" as const, className: "justify-center" },
      { align: "right" as const, className: "justify-end" },
    ];

    for (const { align, className } of cases) {
      const { container } = render(
        <SplitFlapDisplay value="HI" length={6} align={align} />,
      );
      expect(getRoot(container)).toHaveClass(className);
      expect(flaps(container)).toHaveLength(6);
    }
  });

  it("settles every digit when animation ends with a negative maxFlaps", () => {
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    const { container } = render(
      <SplitFlapDisplay value="ABC" maxFlaps={-1} />,
    );

    act(() => {
      intersectionCallback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(risingHalves(container)).toHaveLength(3);

    for (let i = 0; i < 10; i++) {
      const rises = risingHalves(container);
      if (rises.length === 0) break;
      act(() => {
        for (const rise of rises) fireEvent.animationEnd(rise);
      });
    }

    expect(risingHalves(container)).toHaveLength(0);
    expect(
      Array.from(flaps(container)).map((flap) => flap.textContent),
    ).toEqual(["AA", "BB", "CC"]);
  });

  it("normalizes zero, fractional, and non-finite maxFlaps", () => {
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    const cases = [
      {
        maxFlaps: 0,
        value: "C",
        charset: " ABC",
        expectedRises: 0,
        expectedFlips: 0,
      },
      {
        maxFlaps: 1.9,
        value: "C",
        charset: " ABC",
        expectedRises: 1,
        expectedFlips: 1,
      },
      {
        maxFlaps: Infinity,
        value: "M",
        charset: " ABCDEFGHIJKLM",
        expectedRises: 1,
        expectedFlips: 12,
      },
      {
        maxFlaps: Number.NaN,
        value: "M",
        charset: " ABCDEFGHIJKLM",
        expectedRises: 1,
        expectedFlips: 12,
      },
    ];

    for (const {
      maxFlaps,
      value,
      charset,
      expectedRises,
      expectedFlips,
    } of cases) {
      const { container, unmount } = render(
        <SplitFlapDisplay
          value={value}
          charset={charset}
          maxFlaps={maxFlaps}
        />,
      );

      act(() => {
        intersectionCallback?.(
          [{ isIntersecting: true } as IntersectionObserverEntry],
          {} as IntersectionObserver,
        );
      });

      expect(
        risingHalves(container),
        `initial rises for maxFlaps=${String(maxFlaps)}`,
      ).toHaveLength(expectedRises);

      let flips = 0;
      for (let i = 0; i <= 12; i++) {
        const rises = risingHalves(container);
        if (rises.length === 0) break;
        flips += rises.length;
        act(() => {
          for (const rise of rises) fireEvent.animationEnd(rise);
        });
      }

      expect(flips, `flips for maxFlaps=${String(maxFlaps)}`).toBe(
        expectedFlips,
      );
      expect(
        risingHalves(container),
        `remaining rises for maxFlaps=${String(maxFlaps)}`,
      ).toHaveLength(0);
      expect(
        Array.from(flaps(container)).map((flap) => flap.textContent),
      ).toEqual([value + value]);
      unmount();
    }
  });

  it("accepts a per-column charset array", () => {
    const { container } = render(
      <SplitFlapDisplay
        value="12:34"
        charset={["012", "0123456789", ":", "012345", "0123456789"]}
      />,
    );
    expect(flaps(container)).toHaveLength(5);
    expect(getRoot(container)).toHaveAttribute("aria-label", "12:34");
  });

  it("exposes the value as an accessible label", () => {
    const { container } = render(<SplitFlapDisplay value="Gate 22" />);
    expect(getRoot(container)).toHaveAttribute("aria-label", "Gate 22");
  });

  it("forwards the ref to the root element", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<SplitFlapDisplay ref={ref} value="X" />);
    expect(ref.current).toBe(getRoot(container));
  });

  it("merges a custom className and sets a displayName", () => {
    const { container } = render(
      <SplitFlapDisplay className="custom" value="X" />,
    );
    expect(getRoot(container)).toHaveClass("custom");
    expect(SplitFlapDisplay.displayName).toBe("SplitFlapDisplay");
  });
});
