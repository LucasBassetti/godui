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
  it("flags bare Tailwind transition as its default color + shadow list", () => {
    const found = props(`<b className="transition hover:bg-accent" />`);
    expect(found).toContain("backgroundcolor");
    expect(found).toContain("boxshadow");
  });
  it("flags transition-colors as color properties", () => {
    const found = props(`<b className="transition-colors" />`);
    expect(found).toContain("color");
    expect(found).toContain("backgroundcolor");
    expect(found).not.toContain("boxshadow");
  });
  it.each([
    "motion-safe:transition",
    "hover:transition",
    "data-[state=open]:transition",
    "!transition",
  ])("flags variant-prefixed bare %s", (cls) => {
    expect(props(`<b className="${cls}" />`)).toContain("color");
  });
  it("does not flag transition-none or motion-reduce:transition-none", () => {
    expect(
      props(`<b className="transition-none motion-reduce:transition-none" />`),
    ).toEqual([]);
  });
  it("flags duration-* without a transition-* class in the same string (property defaults to all)", () => {
    expect(props(`<b className="duration-200 hover:opacity-50" />`)).toContain(
      "all",
    );
  });
  it("allows duration-* next to a compositor transition", () => {
    expect(props(`<b className="transition-opacity duration-200" />`)).toEqual(
      [],
    );
  });
  it("ignores the word transition in comments", () => {
    expect(
      props(
        `// resets via CSS transition\n/* a transition here */\n<b className="transition-opacity" />`,
      ),
    ).toEqual([]);
  });
  it("flags non-compositor keys in framer variants objects", () => {
    expect(
      props(
        `<m.div variants={{ open: { height: "auto", opacity: 1 }, closed: { height: 0 } }} />`,
      ),
    ).toEqual(["height"]);
  });
  it("flags style keys bound to motion values", () => {
    const src = `const size = useSpring(target);\n<m.div style={{ width: size, x: size, height: 40 }} />`;
    expect(props(src)).toEqual(["width"]);
  });
  it("flags WAAPI keyframe arrays", () => {
    expect(
      props(
        `el.animate([{ height: "0px" }, { height: "40px", opacity: 1 }], 200)`,
      ),
    ).toEqual(["height"]);
  });
  it("allows compositor WAAPI keyframes", () => {
    expect(
      props(`el.animate([{ translate: "0 4px" }, { translate: "0 0" }], 200)`),
    ).toEqual([]);
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
