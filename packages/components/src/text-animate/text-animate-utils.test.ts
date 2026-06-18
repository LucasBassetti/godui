import { describe, expect, it } from "vitest";
import {
  getSegmentClassName,
  resolveTextAnimateVariants,
  STAGGER_BY_SPLIT,
  splitTextAnimate,
  TEXT_ANIMATE_PRESETS,
} from "./text-animate-utils";

describe("splitTextAnimate", () => {
  it("returns the whole string for `text`", () => {
    const segments = splitTextAnimate("hello world", "text");
    expect(segments).toHaveLength(1);
    expect(segments[0].segment).toBe("hello world");
  });

  it("splits into words keeping whitespace tokens", () => {
    const segments = splitTextAnimate("a b", "word");
    expect(segments.map((s) => s.segment)).toEqual(["a", " ", "b"]);
  });

  it("splits into characters", () => {
    const segments = splitTextAnimate("ab", "character");
    expect(segments.map((s) => s.segment)).toEqual(["a", "b"]);
  });

  it("splits into lines", () => {
    const segments = splitTextAnimate("one\ntwo", "line");
    expect(segments.map((s) => s.segment)).toEqual(["one", "two"]);
  });

  it("produces unique keys", () => {
    const segments = splitTextAnimate("a b c", "word");
    const keys = segments.map((s) => s.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe("getSegmentClassName", () => {
  it("uses block for lines and inline-block for characters", () => {
    expect(getSegmentClassName("line")).toBe("block");
    expect(getSegmentClassName("character")).toBe("inline-block");
    expect(getSegmentClassName("word")).toBe("inline-block whitespace-pre");
  });

  it("appends a custom segment class", () => {
    expect(getSegmentClassName("word", "text-red-500")).toBe(
      "inline-block whitespace-pre text-red-500",
    );
  });
});

describe("resolveTextAnimateVariants", () => {
  it("resolves a preset and wires delay + stagger into the container", () => {
    const result = resolveTextAnimateVariants({
      animation: "fadeIn",
      delay: 0.2,
      staggerChildren: 0.05,
    });
    expect(result.item).toBe(TEXT_ANIMATE_PRESETS.fadeIn.item);
    const show = result.container.show as {
      transition: Record<string, number>;
    };
    expect(show.transition.delayChildren).toBe(0.2);
    expect(show.transition.staggerChildren).toBe(0.05);
  });

  it("uses custom variants when provided", () => {
    const custom = { hidden: { opacity: 0 }, show: { opacity: 1 } };
    const result = resolveTextAnimateVariants({
      animation: "fadeIn",
      delay: 0,
      staggerChildren: 0.05,
      customVariants: custom,
    });
    expect(result.item).toBe(custom);
  });
});

describe("STAGGER_BY_SPLIT", () => {
  it("has a stagger value for every split mode", () => {
    expect(Object.keys(STAGGER_BY_SPLIT).sort()).toEqual([
      "character",
      "line",
      "text",
      "word",
    ]);
  });
});
