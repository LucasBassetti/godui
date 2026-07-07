import { render, waitFor } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Gravity, MatterBody } from "./gravity";

function getRoot(container: HTMLElement) {
  return container.querySelector<HTMLElement>(
    '[data-slot="gravity"]',
  ) as HTMLElement;
}

describe("Gravity", () => {
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
