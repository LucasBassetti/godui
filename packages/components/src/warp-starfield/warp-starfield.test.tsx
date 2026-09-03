import { render } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, it } from "vitest";
import {
  createOwnerRealmHarness,
  resetOwnerRealmTestEnvironment,
} from "../lib/owner-realm-test-utils";
import { WarpStarfield } from "./warp-starfield";

afterEach(resetOwnerRealmTestEnvironment);

describe("WarpStarfield", () => {
  it("uses lifecycle APIs from the portaled document's realm", () => {
    const harness = createOwnerRealmHarness();
    const { container, unmount } = render(<WarpStarfield color="red" warp />, {
      container: harness.frameDocument.body,
    });
    const root = container.querySelector<HTMLElement>(
      '[data-slot="warp-starfield"]',
    );

    expect(root).not.toBeNull();
    expect(harness.frameMatchMedia).toHaveBeenCalledWith(
      "(prefers-reduced-motion: reduce)",
    );
    expect(harness.parentMatchMedia).not.toHaveBeenCalled();
    expect(harness.frameResizeConstructor).toHaveBeenCalledOnce();
    expect(harness.frameResizeObserve).toHaveBeenCalledWith(root);
    expect(harness.parentResizeObserver).not.toHaveBeenCalled();
    expect(harness.frameIntersectionConstructor).toHaveBeenCalledOnce();
    expect(harness.frameIntersectionObserve).toHaveBeenCalledWith(root);
    expect(harness.parentIntersectionObserver).not.toHaveBeenCalled();
    expect(harness.frameRaf).toHaveBeenCalled();
    expect(harness.parentRaf).not.toHaveBeenCalled();
    expect(harness.events.indexOf("intersection-observe")).toBeLessThan(
      harness.events.indexOf("raf"),
    );
    expect(
      harness.parentVisibilityAdd.mock.calls.filter(
        ([type]) => type === "visibilitychange",
      ),
    ).toHaveLength(0);
    expect(harness.frameVisibilityAdd).toHaveBeenCalledWith(
      "visibilitychange",
      expect.any(Function),
    );

    unmount();
    expect(harness.frameResizeDisconnect).toHaveBeenCalledOnce();
    expect(harness.frameIntersectionDisconnect).toHaveBeenCalledOnce();
    expect(harness.frameCancel).toHaveBeenCalledOnce();
    expect(harness.frameVisibilityRemove).toHaveBeenCalledWith(
      "visibilitychange",
      expect.any(Function),
    );
    expect(
      harness.parentVisibilityRemove.mock.calls.filter(
        ([type]) => type === "visibilitychange",
      ),
    ).toHaveLength(0);
    harness.frame.remove();
  });

  it("renders a decorative full-bleed canvas layer", () => {
    const { container } = render(<WarpStarfield />);
    const root = container.querySelector("[data-slot='warp-starfield']");
    expect(root).not.toBeNull();
    expect(root?.getAttribute("aria-hidden")).toBe("true");
    expect(root?.className).toContain("z-base");
    expect(container.querySelector("canvas")).not.toBeNull();
  });

  it("renders without throwing in warp mode with custom props", () => {
    expect(() =>
      render(<WarpStarfield warp color="#ffffff" starCount={200} depth={2} />),
    ).not.toThrow();
  });

  it("forwards the ref to the root", () => {
    const ref = createRef<HTMLDivElement>();
    render(<WarpStarfield ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
