import { describe, expect, it } from "vitest";
import { motionTier, propTier } from "./motion-score";

/**
 * Tier tests for the static MotionScore. Each case feeds the signals a real
 * component carries (kind + sanctioned allowlist props) and asserts the official
 * worst-property-wins tier. See motion-score.ts for the model.
 */

describe("motionTier", () => {
  it("grades a static component S", () => {
    expect(motionTier({ isStatic: true })).toBe("S");
  });

  it("grades a compositor-only (no kind) component S", () => {
    expect(motionTier({})).toBe("S");
  });

  it("grades Magic Button C — its worst property is a background-position paint loop", () => {
    // Compositor push-physics (translate/filter) + a rainbow background-position
    // keyframe loop. Worst tier wins: paint-triggering.
    expect(motionTier({ kind: "paint" })).toBe("C");
  });

  it("grades a compute (canvas/WebGL) render loop C — paint-triggering", () => {
    // globe / gravity: JS render loop repaints each frame, never relayouts.
    expect(motionTier({ kind: "compute" })).toBe("C");
  });

  it("grades a layout morph D", () => {
    // dynamic-island: width + height + border-radius shared-layout morph.
    expect(
      motionTier({
        kind: "layout",
        allowlistProps: ["width", "height", "borderradius"],
      }),
    ).toBe("D");
  });

  it("keeps a paint component at C even when it also animates clip-path (S)", () => {
    // image-compare: paint kind + a composited clip-path reveal → worst is C.
    expect(motionTier({ kind: "paint", allowlistProps: ["clippath"] })).toBe(
      "C",
    );
  });

  it("escalates a paint kind to D when it also animates a layout prop", () => {
    expect(motionTier({ kind: "paint", allowlistProps: ["width"] })).toBe("D");
  });
});

describe("propTier", () => {
  it("tiers compositor and paint/layout properties per the official table", () => {
    expect(propTier("translate")).toBe("S");
    expect(propTier("filter")).toBe("S");
    expect(propTier("opacity")).toBe("S");
    expect(propTier("clippath")).toBe("S");
    expect(propTier("backgroundposition")).toBe("C");
    expect(propTier("boxshadow")).toBe("C");
    expect(propTier("borderradius")).toBe("C");
    expect(propTier("x1")).toBe("C"); // SVG geometry attribute → paint
    expect(propTier("x")).toBe("S"); // framer transform shorthand → compositor
    expect(propTier("width")).toBe("D");
    expect(propTier("fontsize")).toBe("D");
  });
});
