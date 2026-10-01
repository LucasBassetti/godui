import { describe, expect, it } from "vitest";
import { cssObjectToString, scanCss } from "./index";

describe("scanCss", () => {
  it("flags non-compositor props inside @keyframes (strict)", () => {
    const css = `@keyframes a { from { opacity: 0; background-position: 0 0; } to { opacity: 1; } }`;
    expect(scanCss(css, { strict: true }).map((v) => v.prop)).toEqual([
      "backgroundposition",
    ]);
  });
  it("accepts transform/opacity/filter keyframes", () => {
    const css = `@keyframes b { 0% { scale: 0.96; translate: 0 4px; opacity: 0; filter: blur(4px) } }`;
    expect(scanCss(css, { strict: true })).toEqual([]);
  });
  it("flags transition declarations listing paint props", () => {
    expect(
      scanCss(`.x { transition: color 0.2s, opacity 0.2s; }`, {
        strict: true,
      }).map((v) => v.prop),
    ).toEqual(["color"]);
  });
  it("treats transition: none as no animation", () => {
    expect(scanCss(`.x { transition: none; }`, { strict: true })).toEqual([]);
  });
  it("ignores declarations outside keyframes that are not transitions", () => {
    expect(
      scanCss(`.x { width: 10px; color: red; }`, { strict: true }),
    ).toEqual([]);
  });
  it("reports line numbers", () => {
    const css = `\n\n@keyframes c {\n  to { height: 0; }\n}`;
    expect(scanCss(css, { strict: true })[0]).toMatchObject({
      line: 4,
      prop: "height",
    });
  });
});

describe("cssObjectToString", () => {
  it("serializes registry css JSON", () => {
    expect(
      cssObjectToString({
        "@keyframes k": { "0%": { "background-position": "0% 50%" } },
      }),
    ).toBe("@keyframes k {\n  0% {\n    background-position: 0% 50%;\n  }\n}");
  });
});
