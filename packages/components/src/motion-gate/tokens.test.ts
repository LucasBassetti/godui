import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PKG = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const ROOT = join(PKG, "..", "..");
const css = readFileSync(join(PKG, "styles.css"), "utf8");
const registry = JSON.parse(readFileSync(join(ROOT, "registry.json"), "utf8"));
const motion = registry.items.find(
  (i: { name: string }) => i.name === "godui-motion",
);

const KEYFRAMES = [
  "godui-fade-scale-in",
  "godui-fade-scale-out",
  "godui-slide-in-from-top",
  "godui-slide-in-from-right",
  "godui-slide-in-from-bottom",
  "godui-slide-in-from-left",
  "godui-slide-out-to-top",
  "godui-slide-out-to-right",
  "godui-slide-out-to-bottom",
  "godui-slide-out-to-left",
  "godui-pop",
  "godui-fade-in",
  "godui-fade-out",
  "godui-popover-in",
  "godui-popover-out",
];

describe("godui-motion tokens", () => {
  it.each(
    KEYFRAMES,
  )("styles.css defines @keyframes %s and its animate token", (k) => {
    expect(css).toContain(`@keyframes ${k} `);
    expect(css).toContain(`--animate-${k}:`);
  });

  it("defines spring easings as linear()", () => {
    for (const e of ["snappy", "smooth", "bouncy"]) {
      expect(css).toMatch(new RegExp(`--ease-spring-${e}: linear\\(`));
    }
  });

  it("scales every keyframe movement by --godui-motion, which only :root sets", () => {
    // Components may override --godui-enter-distance locally (full-panel
    // slides); multiplying by a root-only factor keeps reduced motion in charge.
    const reduced = css.slice(
      css.indexOf("@media (prefers-reduced-motion: reduce)"),
    );
    expect(reduced).toMatch(/--godui-motion:\s*0;/);
    for (const k of KEYFRAMES) {
      const start = css.indexOf(`@keyframes ${k} `);
      const block = css.slice(start, css.indexOf("\n}", start));
      if (/translate:|scale:/.test(block)) {
        expect(block, k).toContain("var(--godui-motion)");
      }
    }
    for (const [name, frames] of Object.entries(motion.css)) {
      if (!name.startsWith("@keyframes")) continue;
      const text = JSON.stringify(frames);
      if (/"(translate|scale)"/.test(text)) {
        expect(text, name).toContain("var(--godui-motion)");
      }
    }
  });

  it("collapses movement under prefers-reduced-motion", () => {
    const reduced = css.slice(
      css.indexOf("@media (prefers-reduced-motion: reduce)"),
    );
    expect(reduced).toMatch(/--godui-enter-scale:\s*1;/);
    expect(reduced).toMatch(/--godui-enter-distance:\s*0px;/);
  });

  it("registry godui-motion ships the same keyframes, tokens and the hook", () => {
    expect(motion).toBeDefined();
    for (const k of KEYFRAMES) {
      expect(motion.css).toHaveProperty([`@keyframes ${k}`]);
      expect(motion.cssVars.theme).toHaveProperty([`animate-${k}`]);
    }
    expect(motion.files.map((f: { target: string }) => f.target)).toContain(
      "hooks/use-flip-group.ts",
    );
  });

  it("does not alias --color-muted to the foreground color", () => {
    for (const f of ["light.css", "dark.css"]) {
      expect(readFileSync(join(PKG, "theme", f), "utf8")).not.toMatch(
        /--color-muted:\s*var\(--muted-foreground\)/,
      );
    }
  });
});
