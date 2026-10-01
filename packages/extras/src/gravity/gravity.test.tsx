import { render, waitFor } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, it } from "vitest";

import {
  createOwnerRealmHarness,
  resetOwnerRealmTestEnvironment,
} from "../lib/owner-realm-test-utils";
import { Gravity, MatterBody } from "./gravity";

afterEach(resetOwnerRealmTestEnvironment);

function getRoot(container: HTMLElement) {
  return container.querySelector<HTMLElement>(
    '[data-slot="gravity"]',
  ) as HTMLElement;
}

describe("Gravity", () => {
  it("uses lifecycle APIs from the portaled document's realm", () => {
    const harness = createOwnerRealmHarness();
    const { container, unmount } = render(
      <Gravity autoStart={false}>
        <MatterBody>
          <span>body</span>
        </MatterBody>
      </Gravity>,
      { container: harness.frameDocument.body },
    );
    const root = getRoot(container);

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

  it("renders the canvas and its bodies", () => {
    const { container } = render(
      <Gravity>
        <MatterBody x="50%" y="10%">
          <span>one</span>
        </MatterBody>
        <MatterBody x="30%" y="20%">
          <span>two</span>
        </MatterBody>
      </Gravity>,
    );
    expect(getRoot(container)).not.toBeNull();
    expect(
      getRoot(container).querySelectorAll('[data-slot="matter-body"]').length,
    ).toBe(2);
  });

  it("registers bodies and drives them via the sync loop", async () => {
    // The engine must exist before child MatterBody effects run; if it doesn't,
    // registration silently no-ops and the sync loop never sets a transform.
    const { container } = render(
      <Gravity>
        <MatterBody x="50%" y="0%">
          <span>falling</span>
        </MatterBody>
      </Gravity>,
    );
    const body = getRoot(container).querySelector<HTMLElement>(
      '[data-slot="matter-body"]',
    );
    await waitFor(() => expect(body?.style.transform).toMatch(/translate/));
  });

  it("mounts and unmounts without throwing", () => {
    const { unmount } = render(
      <Gravity>
        <MatterBody>
          <span>x</span>
        </MatterBody>
      </Gravity>,
    );
    expect(() => unmount()).not.toThrow();
  });

  it("forwards the ref and sets a displayName", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <Gravity ref={ref}>
        <MatterBody>
          <span>x</span>
        </MatterBody>
      </Gravity>,
    );
    expect(ref.current).toBe(getRoot(container));
    expect(Gravity.displayName).toBe("Gravity");
    expect(MatterBody.displayName).toBe("MatterBody");
  });
});
