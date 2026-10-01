import { describe, expect, it } from "vitest";
import { isCompositorProp, scanSource } from "./index";

const props = (src: string, strict = true) =>
  scanSource(src, { strict }).map((v) => v.prop);

describe("isCompositorProp", () => {
  it.each([
    "transform",
    "translate",
    "scale",
    "rotate",
    "opacity",
    "filter",
    "x",
    "y",
    "scalex",
    "rotatez",
    "transformorigin",
  ])("%s is compositor-only", (p) => expect(isCompositorProp(p)).toBe(true));
  it.each([
    "color",
    "backgroundcolor",
    "boxshadow",
    "height",
    "backgroundposition",
    "--progress",
  ])("%s is not", (p) => expect(isCompositorProp(p)).toBe(false));
});

describe("scanSource strict mode", () => {
  it("flags bare Tailwind transition (default list includes colors and shadow)", () => {
    expect(props(`<b className="transition hover:bg-accent" />`)).toContain(
      "transition",
    );
  });
  it("flags transition-colors", () => {
    expect(props(`<b className="transition-colors" />`)).toContain(
      "transitioncolors",
    );
  });
  it("allows transition-opacity and transition-transform", () => {
    expect(
      props(`<b className="transition-opacity transition-transform" />`),
    ).toEqual([]);
  });
  it("flags paint props in arbitrary transition lists", () => {
    expect(props(`<b className="transition-[color,translate]" />`)).toEqual([
      "color",
    ]);
  });
  it("flags paint keys in framer animate objects", () => {
    expect(
      props(`<m.div animate={{ backgroundColor: "#fff", x: 4 }} />`),
    ).toEqual(["backgroundcolor"]);
  });
  it("does not treat a framer transition prop as a class", () => {
    expect(props(`<m.div transition={{ duration: 0.2 }} />`)).toEqual([]);
  });
});

describe("scanSource lenient mode (unchanged)", () => {
  it("allows cheap paint", () => {
    expect(props(`<b className="transition-colors" />`, false)).toEqual([]);
  });
  it("still gates layout", () => {
    expect(props(`<m.div animate={{ height: "auto" }} />`, false)).toEqual([
      "height",
    ]);
  });
});
