import { createElement } from "react";
import { describe, expect, it } from "vitest";
import { clamp, getTextContent, lerp } from "./text-utils";

describe("getTextContent", () => {
  it("returns plain string children", () => {
    expect(getTextContent("hello")).toBe("hello");
  });

  it("stringifies numbers", () => {
    expect(getTextContent(42)).toBe("42");
  });

  it("joins array children", () => {
    expect(getTextContent(["a", "b", "c"])).toBe("abc");
  });

  it("recurses into element children", () => {
    const tree = createElement(
      "span",
      null,
      "wrapped ",
      createElement("b", null, "text"),
    );
    expect(getTextContent(tree)).toBe("wrapped text");
  });

  it("returns null for empty / nullish content", () => {
    expect(getTextContent(null)).toBeNull();
    expect(getTextContent(undefined)).toBeNull();
    expect(getTextContent(false)).toBeNull();
    expect(getTextContent("")).toBeNull();
  });
});

describe("lerp", () => {
  it("interpolates between min and max", () => {
    expect(lerp(0, 10, 0)).toBe(0);
    expect(lerp(0, 10, 1)).toBe(10);
    expect(lerp(0, 10, 0.5)).toBe(5);
  });

  it("extrapolates past the range", () => {
    expect(lerp(0, 10, 2)).toBe(20);
  });
});

describe("clamp", () => {
  it("keeps values inside the range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("clamps below min and above max", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });
});
